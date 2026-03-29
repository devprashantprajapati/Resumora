import { useResumeStore } from '@/store/useResumeStore';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { suggestSkills } from '@/services/ai';
import { useState } from 'react';
import { Wand2, Plus, Trash2, GripVertical } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '../ui/Card';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from '../ui/SortableItem';

export function SkillsForm() {
  const { data, addSkill, updateSkill, removeSkill, reorderItems } = useResumeStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    addSkill({
      id: uuidv4(),
      name: '',
      level: 'Intermediate',
    });
  };

  const handleSuggest = async () => {
    if (!data.personalInfo.title) return;
    setIsGenerating(true);
    try {
      const suggestions = await suggestSkills(data.personalInfo.title);
      
      // Add new skills that don't already exist
      const existingNames = new Set((data.skills || []).map(s => s.name.toLowerCase()));
      suggestions.forEach(skillName => {
        if (!existingNames.has(skillName.toLowerCase())) {
          addSkill({
            id: uuidv4(),
            name: skillName,
            level: 'Intermediate',
          });
        }
      });
    } catch (error: any) {
      console.error("Failed to suggest skills:", error);
      if (error?.message?.includes('429') || error?.message?.toLowerCase().includes('rate')) {
        toast.error('AI Rate Limit Exceeded', {
          description: 'Please wait a moment before trying again.',
        });
      } else {
        toast.error('Failed to suggest skills', {
          description: 'An unexpected error occurred. Please try again.',
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.skills.findIndex((item) => item.id === active.id);
      const newIndex = data.skills.findIndex((item) => item.id === over.id);
      reorderItems('skills', oldIndex, newIndex);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-zinc-50/80 p-5 rounded-2xl border border-zinc-100/50 shadow-sm">
        <div>
          <h4 className="text-sm font-semibold text-zinc-900">AI Skill Suggestions</h4>
          <p className="text-xs text-zinc-700/80 mt-1.5">Get relevant skills based on your title: <span className="font-semibold text-zinc-800">{data.personalInfo.title || 'Not set'}</span></p>
        </div>
        <Button 
          onClick={handleSuggest} 
          isLoading={isGenerating}
          disabled={!data.personalInfo.title}
          size="sm"
          className="bg-zinc-600 hover:bg-zinc-700 text-white shadow-md shadow-zinc-200 rounded-xl h-9"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Suggest
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={(data.skills || []).map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.skills || []).map((skill) => (
              <SortableItem key={skill.id} id={skill.id}>
                <SkillCard 
                  skill={skill} 
                  updateSkill={updateSkill} 
                  removeSkill={removeSkill} 
                />
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button variant="outline" className="w-full border-dashed border-2 hover:border-zinc-300 hover:bg-zinc-50/50 text-zinc-600 hover:text-zinc-600 transition-all" onClick={handleAdd}>
        <Plus className="w-4 h-4 mr-2" />
        Add Skill
      </Button>
    </div>
  );
}

function SkillCard({ skill, updateSkill, removeSkill, dragHandleProps, isDragging }: any) {
  return (
    <Card className={`p-3 flex items-center gap-3 border-zinc-200/60 bg-white/40 hover:bg-white/60 transition-colors ${isDragging ? 'opacity-50' : ''}`}>
      <div {...dragHandleProps} className="p-1 text-zinc-400 hover:text-zinc-600 cursor-grab active:cursor-grabbing rounded-lg hover:bg-zinc-100">
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="flex-1 space-y-1">
        <Input 
          required
          value={skill.name} 
          onChange={(e) => updateSkill(skill.id, { name: e.target.value })} 
          placeholder="Skill name (e.g. React) *"
          className="h-10 text-sm bg-white"
        />
      </div>
      <div className="w-1/3">
        <select 
          value={skill.level}
          onChange={(e) => updateSkill(skill.id, { level: e.target.value })}
          className="flex h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 py-1 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 hover:bg-white"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>
      </div>
      <Button variant="ghost" size="icon" onClick={() => removeSkill(skill.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-10 w-10 shrink-0 rounded-lg">
        <Trash2 className="w-4 h-4" />
      </Button>
    </Card>
  );
}
