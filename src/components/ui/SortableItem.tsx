import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    position: 'relative' as const,
    ...(isDragging ? {
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      scale: '1.02',
    } : {})
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* We pass attributes and listeners to the child so it can attach the drag handle where needed */}
      {React.cloneElement(children as React.ReactElement<any>, {
        dragHandleProps: { ...attributes, ...listeners },
        isDragging,
      })}
    </div>
  );
};
