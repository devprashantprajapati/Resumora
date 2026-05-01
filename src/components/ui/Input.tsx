import { InputHTMLAttributes, forwardRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  debounceTime?: number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, debounceTime = 300, value: externalValue, onChange, ...props }, ref) => {
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
      <input
        type={type}
        className={cn("pro-input", className)}
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
Input.displayName = 'Input';
