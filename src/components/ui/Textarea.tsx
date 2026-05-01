import { TextareaHTMLAttributes, forwardRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  debounceTime?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, debounceTime = 300, value: externalValue, onChange, ...props }, ref) => {
    const [localValue, setLocalValue] = useState(externalValue ?? '');

    useEffect(() => {
      setLocalValue(externalValue ?? '');
    }, [externalValue]);

    useEffect(() => {
      const handler = setTimeout(() => {
        if (localValue !== externalValue && localValue !== '') {
          if (onChange) {
            onChange({
              target: { value: localValue }
            } as any);
          }
        } else if (localValue === '' && externalValue !== '' && externalValue !== undefined) {
          if (onChange) {
            onChange({
              target: { value: localValue }
            } as any);
          }
        }
      }, debounceTime);

      return () => clearTimeout(handler);
    }, [localValue, externalValue, onChange, debounceTime]);

    return (
      <textarea
        className={cn(
          "pro-input min-h-[120px] h-auto py-3.5 resize-y leading-relaxed",
          className
        )}
        ref={ref}
        value={localValue === null ? '' : localValue}
        onChange={(e) => {
          setLocalValue(e.target.value);
        }}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
