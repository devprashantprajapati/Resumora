import { useResumeStore } from '@/store/useResumeStore';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';

export function CustomSectionForm({ sectionId }: { sectionId: string }) {
  const { data, updateCustomSection, addCustomSectionItem, removeCustomSectionItem, updateCustomSectionItem } = useResumeStore();
  const section = data.customSections?.find(s => s.id === sectionId);
  const [expandedId, setExpandedId] = useState<string | null>(section?.items[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!section) return null;

  const handleAdd = () => {
    const newId = uuidv4();
    addCustomSectionItem(sectionId, {
      id: newId,
      title: '',
      subtitle: '',
      date: '',
      description: ''
    });
    setExpandedId(newId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = section.items.findIndex((item) => item.id === active.id);
      const newIndex = section.items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(section.items, oldIndex, newIndex);
      updateCustomSection(sectionId, { items: newItems });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 mb-8 bg-zinc-50 p-4 rounded-xl border border-zinc-200/60">
        <Label>Section Name <span className="text-red-500">*</span></Label>
        <Input 
          value={section.name}
          onChange={(e) => updateCustomSection(sectionId, { name: e.target.value })}
          placeholder="e.g. Volunteer Work, Awards, Publications"
          className="bg-white"
        />
        <p className="text-xs text-zinc-500 mt-1">This name will appear as the section header on your resume.</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={section.items.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {section.items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              <CustomItemCard 
                item={item} 
                sectionId={sectionId}
                updateCustomSectionItem={updateCustomSectionItem} 
                removeCustomSectionItem={removeCustomSectionItem} 
                isExpanded={expandedId === item.id}
                onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
              />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outline" className="w-full border-dashed border-2 border-zinc-300/80 bg-zinc-50/50 hover:border-indigo-300 hover:bg-indigo-50/50 text-zinc-600 hover:text-indigo-700 transition-all duration-300 rounded-xl h-12 shadow-sm hover:shadow-md font-semibold group" onClick={handleAdd}>
        <Plus className="w-5 h-5 mr-2 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
        Add Item
      </Button>
    </div>
  );
}

function CustomItemCard({ item, sectionId, updateCustomSectionItem, removeCustomSectionItem, dragHandleProps, isDragging, isExpanded, onToggle }: any) {
  return (
    <Card className={`p-0 overflow-hidden relative group border-zinc-200/60 bg-white/60 backdrop-blur-sm hover:bg-white transition-all duration-300 mb-4 pro-card ${isDragging ? 'opacity-50 scale-[0.98] shadow-lg' : ''}`}>
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
              {item.title || '(Untitled Item)'}
            </span>
            <span className="text-xs text-zinc-500 truncate">
              {item.subtitle || 'Subtitle'} {item.date && `• ${item.date}`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeCustomSectionItem(sectionId, item.id); }} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
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
                  <Label>Title <span className="text-red-500">*</span></Label>
                  <Input 
                    value={item.title} 
                    onChange={(e) => updateCustomSectionItem(sectionId, item.id, { title: e.target.value })} 
                    placeholder="e.g. Best Developer Award"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle / Organization</Label>
                  <Input 
                    value={item.subtitle} 
                    onChange={(e) => updateCustomSectionItem(sectionId, item.id, { subtitle: e.target.value })} 
                    placeholder="e.g. Google"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Date</Label>
                  <Input 
                    value={item.date} 
                    onChange={(e) => updateCustomSectionItem(sectionId, item.id, { date: e.target.value })} 
                    placeholder="e.g. 2023 or Jan 2022 - Present"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={item.description} 
                  onChange={(e) => updateCustomSectionItem(sectionId, item.id, { description: e.target.value })} 
                  placeholder="• Describe the award, project, or role here..."
                  className="h-32 font-mono text-sm leading-relaxed"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
