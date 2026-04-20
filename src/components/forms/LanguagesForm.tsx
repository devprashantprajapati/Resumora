import { useResumeStore } from '@/store/useResumeStore';
import { Input } from '../ui/Input';
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

export function LanguagesForm() {
  const { data, addLanguage, updateLanguage, removeLanguage, reorderItems } = useResumeStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    addLanguage({
      id: uuidv4(),
      name: '',
      proficiency: 'Native',
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.languages.findIndex((item) => item.id === active.id);
      const newIndex = data.languages.findIndex((item) => item.id === over.id);
      reorderItems('languages', oldIndex, newIndex);
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
          items={(data.languages || []).map(l => l.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.languages || []).map((lang) => (
              <SortableItem key={lang.id} id={lang.id}>
                <LanguageCard 
                  lang={lang} 
                  updateLanguage={updateLanguage} 
                  removeLanguage={removeLanguage} 
                />
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button variant="outline" className="w-full border-dashed border-2 border-zinc-300/80 bg-zinc-50/50 hover:border-indigo-300 hover:bg-indigo-50/50 text-zinc-600 hover:text-indigo-700 transition-all duration-300 rounded-xl h-12 shadow-sm hover:shadow-md font-semibold group" onClick={handleAdd}>
        <Plus className="w-5 h-5 mr-2 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
        Add Language
      </Button>
    </div>
  );
}

function LanguageCard({ lang, updateLanguage, removeLanguage, dragHandleProps, isDragging }: any) {
  return (
    <Card className={`p-3 flex items-center gap-3 border-zinc-200/60 bg-white/60 backdrop-blur-sm hover:bg-white transition-all duration-300 pro-card ${isDragging ? 'opacity-50 scale-[0.98] shadow-lg' : ''}`}>
      <div {...dragHandleProps} className="p-1 text-zinc-400 hover:text-zinc-600 cursor-grab active:cursor-grabbing rounded-lg hover:bg-zinc-100">
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="flex-1 space-y-1">
        <Input 
          required
          value={lang.name} 
          onChange={(e) => updateLanguage(lang.id, { name: e.target.value })} 
          placeholder="Language (e.g. English) *"
          className="h-10 text-sm bg-white"
        />
      </div>
      <div className="w-1/3">
        <select 
          value={lang.proficiency}
          onChange={(e) => updateLanguage(lang.id, { proficiency: e.target.value })}
          className="pro-select h-10 w-full"
        >
          <option value="Native">Native</option>
          <option value="Fluent">Fluent</option>
          <option value="Proficient">Proficient</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Basic">Basic</option>
        </select>
      </div>
      <Button variant="ghost" size="icon" onClick={() => removeLanguage(lang.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-10 w-10 shrink-0 rounded-lg">
        <Trash2 className="w-4 h-4" />
      </Button>
    </Card>
  );
}
