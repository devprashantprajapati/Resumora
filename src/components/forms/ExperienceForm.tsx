import { useResumeStore } from '@/store/useResumeStore';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { enhanceDescription } from '@/services/ai';
import { useState } from 'react';
import { Wand2, Plus, Trash2, GripVertical } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '../ui/Card';
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

export function ExperienceForm() {
  const { data, addExperience, updateExperience, removeExperience, reorderItems } = useResumeStore();
  const [enhancingId, setEnhancingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    addExperience({
      id: uuidv4(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
  };

  const handleEnhance = async (id: string, description: string, position: string) => {
    if (!description || !position) return;
    setEnhancingId(id);
    const enhanced = await enhanceDescription(description, position);
    updateExperience(id, { description: enhanced });
    setEnhancingId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.experience.findIndex((item) => item.id === active.id);
      const newIndex = data.experience.findIndex((item) => item.id === over.id);
      reorderItems('experience', oldIndex, newIndex);
    }
  };

  return (
    <div className="space-y-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.experience.map(e => e.id)}
          strategy={verticalListSortingStrategy}
        >
          {data.experience.map((exp) => (
            <SortableItem key={exp.id} id={exp.id}>
              <ExperienceCard 
                exp={exp} 
                updateExperience={updateExperience} 
                removeExperience={removeExperience} 
                handleEnhance={handleEnhance} 
                enhancingId={enhancingId} 
              />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outline" className="w-full border-dashed border-2 hover:border-zinc-300 hover:bg-zinc-50/50 text-zinc-600 hover:text-zinc-600 transition-all" onClick={handleAdd}>
        <Plus className="w-4 h-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );
}

function ExperienceCard({ exp, updateExperience, removeExperience, handleEnhance, enhancingId, dragHandleProps, isDragging }: any) {
  return (
    <Card className={`p-5 relative group border-zinc-200/60 bg-white/40 hover:bg-white/60 transition-colors mb-6 ${isDragging ? 'opacity-50' : ''}`}>
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div {...dragHandleProps} className="p-2 text-zinc-400 hover:text-zinc-600 cursor-grab active:cursor-grabbing rounded-lg hover:bg-zinc-100">
          <GripVertical className="w-4 h-4" />
        </div>
        <Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-lg">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 pr-16">
        <div className="space-y-2">
          <Label>Job Title</Label>
          <Input 
            value={exp.position} 
            onChange={(e) => updateExperience(exp.id, { position: e.target.value })} 
            placeholder="Software Engineer"
          />
        </div>
        <div className="space-y-2">
          <Label>Company</Label>
          <Input 
            value={exp.company} 
            onChange={(e) => updateExperience(exp.id, { company: e.target.value })} 
            placeholder="Google"
          />
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input 
            type="month"
            value={exp.startDate} 
            onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} 
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <div className="flex items-center gap-3">
            <Input 
              type="month"
              value={exp.endDate} 
              disabled={exp.current}
              onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })} 
              className="flex-1"
            />
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 whitespace-nowrap cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: '' })}
                className="w-4 h-4 rounded border-zinc-300 text-zinc-600 focus:ring-zinc-500/50 transition-all"
              />
              Current
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Description</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleEnhance(exp.id, exp.description, exp.position)}
            isLoading={enhancingId === exp.id}
            className="text-zinc-600 border-zinc-200 hover:bg-zinc-50 h-8 text-xs rounded-lg"
          >
            <Wand2 className="w-3 h-3 mr-2" />
            AI Enhance
          </Button>
        </div>
        <Textarea 
          value={exp.description} 
          onChange={(e) => updateExperience(exp.id, { description: e.target.value })} 
          placeholder="• Developed new features...&#10;• Led a team of..."
          className="h-32 font-mono text-sm leading-relaxed"
        />
      </div>
    </Card>
  );
}
