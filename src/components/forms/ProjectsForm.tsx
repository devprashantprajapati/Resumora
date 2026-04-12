import { useResumeStore } from '@/store/useResumeStore';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { enhanceDescriptionStream } from '@/services/ai';
import { useState } from 'react';
import { Wand2, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';

export function ProjectsForm() {
  const { data, addProject, updateProject, removeProject, reorderItems } = useResumeStore();
  const [enhancingId, setEnhancingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>((data.projects || [])[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    const newId = uuidv4();
    addProject({
      id: newId,
      name: '',
      description: '',
      url: '',
      startDate: '',
      endDate: '',
    });
    setExpandedId(newId);
  };

  const handleEnhance = async (id: string, description: string, name: string) => {
    if (!description || !name) return;
    setEnhancingId(id);
    try {
      updateProject(id, { description: '' });
      let fullText = '';
      const stream = enhanceDescriptionStream(description, `Project: ${name}`);
      for await (const chunk of stream) {
        fullText += chunk;
        updateProject(id, { description: fullText });
      }
    } catch (error: any) {
      console.error("Failed to enhance description:", error);
      updateProject(id, { description }); // Restore original on error
      if (error?.message?.includes('429') || error?.message?.toLowerCase().includes('rate')) {
        toast.error('AI Rate Limit Exceeded', {
          description: 'Please wait a moment before trying again.',
        });
      } else {
        toast.error('Failed to enhance description', {
          description: 'An unexpected error occurred. Please try again.',
        });
      }
    } finally {
      setEnhancingId(null);
    }
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
          items={(data.projects || []).map(p => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {(data.projects || []).map((project) => (
            <SortableItem key={project.id} id={project.id}>
              <ProjectCard 
                project={project} 
                updateProject={updateProject} 
                removeProject={removeProject} 
                handleEnhance={handleEnhance}
                enhancingId={enhancingId}
                isExpanded={expandedId === project.id}
                onToggle={() => setExpandedId(expandedId === project.id ? null : project.id)}
              />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outline" className="w-full border-dashed border-2 border-zinc-300/80 bg-zinc-50/50 hover:border-indigo-300 hover:bg-indigo-50/50 text-zinc-600 hover:text-indigo-700 transition-all duration-300 rounded-xl h-12 shadow-sm hover:shadow-md font-semibold group" onClick={handleAdd}>
        <Plus className="w-5 h-5 mr-2 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
        Add Project
      </Button>
    </div>
  );
}

function ProjectCard({ project, updateProject, removeProject, handleEnhance, enhancingId, dragHandleProps, isDragging, isExpanded, onToggle }: any) {
  return (
    <Card className={`p-0 overflow-hidden relative group border-zinc-200/60 bg-white/40 hover:bg-white/60 transition-colors mb-4 pro-card ${isDragging ? 'opacity-50' : ''}`}>
      {/* Header / Collapsible Trigger */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div {...dragHandleProps} className="p-1.5 text-zinc-400 hover:text-zinc-600 cursor-grab active:cursor-grabbing rounded-lg hover:bg-zinc-100" onClick={(e) => e.stopPropagation()}>
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="flex flex-col truncate">
            <span className="font-semibold text-zinc-900 truncate">
              {project.name || '(Not specified)'}
            </span>
            <span className="text-xs text-zinc-500 truncate">
              {project.startDate || 'Start'} - {project.endDate || 'End'} {project.url ? `• ${project.url}` : ''}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeProject(project.id); }} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <Trash2 className="w-4 h-4" />
          </Button>
          <div className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="p-5 pt-0 border-t border-zinc-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 mt-4">
                <div className="space-y-2">
                  <Label>Project Name <span className="text-red-500">*</span></Label>
                  <Input 
                    required
                    value={project.name} 
                    onChange={(e) => updateProject(project.id, { name: e.target.value })} 
                    placeholder="e.g. E-commerce Platform"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Project URL (Optional)</Label>
                  <div className="relative flex items-center">
                    <Input 
                      type="url"
                      value={project.url} 
                      onChange={(e) => updateProject(project.id, { url: e.target.value })} 
                      placeholder="e.g. https://github.com/..."
                      className="w-full pr-10"
                    />
                    {project.url && (
                      <a 
                        href={project.url.startsWith('http') ? project.url : `https://${project.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute right-2 p-1.5 text-zinc-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-indigo-50"
                        title="Test Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
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
                    disabled={enhancingId !== null || !project.description || !project.name}
                    className="text-indigo-700 border-indigo-200/60 bg-indigo-50/60 hover:bg-indigo-50 hover:border-indigo-300 h-8 text-xs rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <Wand2 className="w-3 h-3 mr-2 text-indigo-500" />
                    AI Enhance
                  </Button>
                </div>
                <Textarea 
                  value={project.description} 
                  onChange={(e) => updateProject(project.id, { description: e.target.value })} 
                  placeholder="• Built a scalable platform...&#10;• Used React and Node.js..."
                  className="h-32 font-mono text-sm leading-relaxed"
                />
                <p className="text-xs text-zinc-500 mt-1">Highlight the technologies used and the impact of the project.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
