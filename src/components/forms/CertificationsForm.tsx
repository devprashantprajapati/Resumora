import { useResumeStore } from '@/store/useResumeStore';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Plus, Trash2, GripVertical } from 'lucide-react';
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

export function CertificationsForm() {
  const { data, addCertification, updateCertification, removeCertification, reorderItems } = useResumeStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    addCertification({
      id: uuidv4(),
      name: '',
      issuer: '',
      date: '',
      url: '',
    });
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
          items={data.certifications.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {data.certifications.map((cert) => (
            <SortableItem key={cert.id} id={cert.id}>
              <CertificationCard 
                cert={cert} 
                updateCertification={updateCertification} 
                removeCertification={removeCertification} 
              />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outline" className="w-full border-dashed border-2 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-600 hover:text-indigo-600 transition-all" onClick={handleAdd}>
        <Plus className="w-4 h-4 mr-2" />
        Add Certification
      </Button>
    </div>
  );
}

function CertificationCard({ cert, updateCertification, removeCertification, dragHandleProps, isDragging }: any) {
  return (
    <Card className={`p-5 relative group border-slate-200/60 bg-white/40 hover:bg-white/60 transition-colors mb-6 ${isDragging ? 'opacity-50' : ''}`}>
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div {...dragHandleProps} className="p-2 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing rounded-lg hover:bg-slate-100">
          <GripVertical className="w-4 h-4" />
        </div>
        <Button variant="ghost" size="icon" onClick={() => removeCertification(cert.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-lg">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pr-16">
        <div className="space-y-2">
          <Label>Certification Name</Label>
          <Input 
            value={cert.name} 
            onChange={(e) => updateCertification(cert.id, { name: e.target.value })} 
            placeholder="AWS Certified Solutions Architect"
          />
        </div>
        <div className="space-y-2">
          <Label>Issuer</Label>
          <Input 
            value={cert.issuer} 
            onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })} 
            placeholder="Amazon Web Services"
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
          <Input 
            value={cert.url} 
            onChange={(e) => updateCertification(cert.id, { url: e.target.value })} 
            placeholder="https://..."
          />
        </div>
      </div>
    </Card>
  );
}
