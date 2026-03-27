import { useResumeStore } from '@/store/useResumeStore';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '../ui/Card';
import { useState } from 'react';
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

export function EducationForm() {
  const { data, addEducation, updateEducation, removeEducation, reorderItems } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(data.education[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    const newId = uuidv4();
    addEducation({
      id: newId,
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
    setExpandedId(newId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.education.findIndex((item) => item.id === active.id);
      const newIndex = data.education.findIndex((item) => item.id === over.id);
      reorderItems('education', oldIndex, newIndex);
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
          items={data.education.map(e => e.id)}
          strategy={verticalListSortingStrategy}
        >
          {data.education.map((edu) => (
            <SortableItem key={edu.id} id={edu.id}>
              <EducationCard 
                edu={edu} 
                updateEducation={updateEducation} 
                removeEducation={removeEducation} 
                isExpanded={expandedId === edu.id}
                onToggle={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
              />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outline" className="w-full border-dashed border-2 hover:border-zinc-300 hover:bg-zinc-50/50 text-zinc-600 hover:text-zinc-600 transition-all" onClick={handleAdd}>
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
}

function EducationCard({ edu, updateEducation, removeEducation, dragHandleProps, isDragging, isExpanded, onToggle }: any) {
  return (
    <Card className={`p-0 overflow-hidden relative group border-zinc-200/60 bg-white/40 hover:bg-white/60 transition-colors mb-4 ${isDragging ? 'opacity-50' : ''}`}>
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
              {edu.school || '(Not specified)'}
            </span>
            <span className="text-xs text-zinc-500 truncate">
              {edu.degree || 'Degree'} {edu.field ? `in ${edu.field}` : ''} • {edu.startDate || 'Start'} - {edu.current ? 'Present' : (edu.endDate || 'End')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
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
                  <Label>School / University <span className="text-red-500">*</span></Label>
                  <Input 
                    required
                    value={edu.school} 
                    onChange={(e) => updateEducation(edu.id, { school: e.target.value })} 
                    placeholder="e.g. Stanford University"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Degree <span className="text-red-500">*</span></Label>
                  <Input 
                    required
                    value={edu.degree} 
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} 
                    placeholder="e.g. Bachelor of Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <Input 
                    value={edu.field} 
                    onChange={(e) => updateEducation(edu.id, { field: e.target.value })} 
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input 
                    type="month"
                    value={edu.startDate} 
                    onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <div className="flex items-center gap-3">
                    <Input 
                      type="month"
                      value={edu.endDate} 
                      disabled={edu.current}
                      onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })} 
                      className="flex-1"
                    />
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 whitespace-nowrap cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={edu.current}
                        onChange={(e) => updateEducation(edu.id, { current: e.target.checked, endDate: '' })}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-600 focus:ring-zinc-500/50 transition-all"
                      />
                      Current
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea 
                  value={edu.description} 
                  onChange={(e) => updateEducation(edu.id, { description: e.target.value })} 
                  placeholder="Relevant coursework, honors, GPA..."
                  className="h-24 leading-relaxed"
                />
                <p className="text-xs text-zinc-500 mt-1">Add any notable achievements, societies, or relevant coursework.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
