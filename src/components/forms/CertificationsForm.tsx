import { useResumeStore } from '@/store/useResumeStore';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
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
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CertificationsForm() {
  const { data, addCertification, updateCertification, removeCertification, reorderItems } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>((data.certifications || [])[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    const newId = uuidv4();
    addCertification({
      id: newId,
      name: '',
      issuer: '',
      date: '',
      url: '',
    });
    setExpandedId(newId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.certifications.findIndex((item) => item.id === active.id);
      const newIndex = data.certifications.findIndex((item) => item.id === over.id);
      reorderItems('certifications', oldIndex, newIndex);
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
          items={(data.certifications || []).map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {(data.certifications || []).map((cert) => (
            <SortableItem key={cert.id} id={cert.id}>
              <CertificationCard 
                cert={cert} 
                updateCertification={updateCertification} 
                removeCertification={removeCertification} 
                isExpanded={expandedId === cert.id}
                onToggle={() => setExpandedId(expandedId === cert.id ? null : cert.id)}
              />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outline" className="w-full border-dashed border-2 border-zinc-300/80 bg-zinc-50/50 hover:border-indigo-300 hover:bg-indigo-50/50 text-zinc-600 hover:text-indigo-700 transition-all duration-300 rounded-xl h-12 shadow-sm hover:shadow-md font-semibold group" onClick={handleAdd}>
        <Plus className="w-5 h-5 mr-2 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
        Add Certification
      </Button>
    </div>
  );
}

function CertificationCard({ cert, updateCertification, removeCertification, dragHandleProps, isDragging, isExpanded, onToggle }: any) {
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
              {cert.name || '(Not specified)'}
            </span>
            <span className="text-xs text-zinc-500 truncate">
              {cert.issuer || 'Issuer'} {cert.date ? `• ${cert.date}` : ''}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeCertification(cert.id); }} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                <div className="space-y-2">
                  <Label>Certification Name <span className="text-red-500">*</span></Label>
                  <Input 
                    required
                    value={cert.name} 
                    onChange={(e) => updateCertification(cert.id, { name: e.target.value })} 
                    placeholder="e.g. AWS Certified Solutions Architect"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Issuer <span className="text-red-500">*</span></Label>
                  <Input 
                    required
                    value={cert.issuer} 
                    onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })} 
                    placeholder="e.g. Amazon Web Services"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="month"
                    value={cert.date} 
                    onChange={(e) => updateCertification(cert.id, { date: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL (Optional)</Label>
                  <div className="relative flex items-center">
                    <Input 
                      type="url"
                      value={cert.url} 
                      onChange={(e) => updateCertification(cert.id, { url: e.target.value })} 
                      placeholder="e.g. https://..."
                      className="w-full pr-10"
                    />
                    {cert.url && (
                      <a 
                        href={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`} 
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
