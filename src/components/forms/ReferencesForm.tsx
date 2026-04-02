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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from '../ui/SortableItem';

export function ReferencesForm() {
  const { data, addReference, updateReference, removeReference, reorderItems } = useResumeStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    addReference({
      id: uuidv4(),
      name: '',
      position: '',
      company: '',
      email: '',
      phone: '',
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.references.findIndex((item) => item.id === active.id);
      const newIndex = data.references.findIndex((item) => item.id === over.id);
      reorderItems('references', oldIndex, newIndex);
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
          items={(data.references || []).map(r => r.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {(data.references || []).map((reference) => (
              <SortableItem key={reference.id} id={reference.id}>
                <ReferenceCard 
                  reference={reference} 
                  updateReference={updateReference} 
                  removeReference={removeReference} 
                />
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button variant="outline" className="w-full border-dashed border-2 border-zinc-300/80 bg-zinc-50/50 hover:border-indigo-300 hover:bg-indigo-50/50 text-zinc-600 hover:text-indigo-700 transition-all duration-300 rounded-xl h-12 shadow-sm hover:shadow-md font-semibold group" onClick={handleAdd}>
        <Plus className="w-5 h-5 mr-2 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
        Add Reference
      </Button>
    </div>
  );
}

function ReferenceCard({ reference, updateReference, removeReference, dragHandleProps, isDragging }: any) {
  return (
    <Card className={`p-5 border-zinc-200/60 bg-white/40 hover:bg-white/60 transition-colors pro-card ${isDragging ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div {...dragHandleProps} className="p-1.5 -ml-1.5 text-zinc-400 hover:text-zinc-600 cursor-grab active:cursor-grabbing rounded-lg hover:bg-zinc-100">
          <GripVertical className="w-5 h-5" />
        </div>
        <Button variant="ghost" size="icon" onClick={() => removeReference(reference.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 rounded-lg -mr-1.5 -mt-1.5">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Name *</Label>
          <Input 
            required
            value={reference.name} 
            onChange={(e) => updateReference(reference.id, { name: e.target.value })} 
            placeholder="Jane Smith"
            className="bg-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Company</Label>
          <Input 
            value={reference.company} 
            onChange={(e) => updateReference(reference.id, { company: e.target.value })} 
            placeholder="Tech Innovators Inc."
            className="bg-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Position</Label>
          <Input 
            value={reference.position} 
            onChange={(e) => updateReference(reference.id, { position: e.target.value })} 
            placeholder="CTO"
            className="bg-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Email</Label>
          <Input 
            type="email"
            value={reference.email} 
            onChange={(e) => updateReference(reference.id, { email: e.target.value })} 
            placeholder="jane.smith@example.com"
            className="bg-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Phone</Label>
          <Input 
            value={reference.phone} 
            onChange={(e) => updateReference(reference.id, { phone: e.target.value })} 
            placeholder="+1 (555) 987-6543"
            className="bg-white"
          />
        </div>
      </div>
    </Card>
  );
}
