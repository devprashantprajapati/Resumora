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

export function ProjectsForm() {
  const { data, addProject, updateProject, removeProject, reorderItems } = useResumeStore();
  const [enhancingId, setEnhancingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    addProject({
      id: uuidv4(),
      name: '',
      description: '',
      url: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleEnhance = async (id: string, description: string, name: string) => {
    if (!description || !name) return;
    setEnhancingId(id);
    const enhanced = await enhanceDescription(description, `Project: ${name}`);
    updateProject(id, { description: enhanced });
    setEnhancingId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.projects.findIndex((item) => item.id === active.id);
      const newIndex = data.projects.findIndex((item) => item.id === over.id);
      reorderItems('projects', oldIndex, newIndex);
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
          items={data.projects.map(p => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {data.projects.map((project) => (
            <SortableItem key={project.id} id={project.id}>
              <ProjectCard 
                project={project} 
                updateProject={updateProject} 
                removeProject={removeProject} 
                handleEnhance={handleEnhance}
                enhancingId={enhancingId}
              />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outline" className="w-full border-dashed border-2 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-600 hover:text-indigo-600 transition-all" onClick={handleAdd}>
        <Plus className="w-4 h-4 mr-2" />
        Add Project
      </Button>
    </div>
  );
}

function ProjectCard({ project, updateProject, removeProject, handleEnhance, enhancingId, dragHandleProps, isDragging }: any) {
  return (
    <Card className={`p-5 relative group border-slate-200/60 bg-white/40 hover:bg-white/60 transition-colors mb-6 ${isDragging ? 'opacity-50' : ''}`}>
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div {...dragHandleProps} className="p-2 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing rounded-lg hover:bg-slate-100">
          <GripVertical className="w-4 h-4" />
        </div>
        <Button variant="ghost" size="icon" onClick={() => removeProject(project.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-lg">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 pr-16">
        <div className="space-y-2">
          <Label>Project Name</Label>
          <Input 
            value={project.name} 
            onChange={(e) => updateProject(project.id, { name: e.target.value })} 
            placeholder="E-commerce Platform"
          />
        </div>
        <div className="space-y-2">
          <Label>Project URL (Optional)</Label>
          <Input 
            value={project.url} 
            onChange={(e) => updateProject(project.id, { url: e.target.value })} 
            placeholder="github.com/..."
          />
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input 
            type="month"
            value={project.startDate} 
            onChange={(e) => updateProject(project.id, { startDate: e.target.value })} 
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input 
            type="month"
            value={project.endDate} 
            onChange={(e) => updateProject(project.id, { endDate: e.target.value })} 
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Description</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleEnhance(project.id, project.description, project.name)}
            isLoading={enhancingId === project.id}
            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 h-8 text-xs rounded-lg"
          >
            <Wand2 className="w-3 h-3 mr-2" />
            AI Enhance
          </Button>
        </div>
        <Textarea 
          value={project.description} 
          onChange={(e) => updateProject(project.id, { description: e.target.value })} 
          placeholder="• Built a scalable platform...&#10;• Used React and Node.js..."
          className="h-32 font-mono text-sm leading-relaxed"
        />
      </div>
    </Card>
  );
}
