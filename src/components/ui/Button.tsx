import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'danger';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      default: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md shadow-indigo-200/50',
      outline: 'border border-slate-200 bg-white/50 hover:bg-white text-slate-700 hover:border-slate-300 shadow-sm',
      ghost: 'bg-transparent hover:bg-slate-100/80 text-slate-700',
      secondary: 'bg-slate-100/80 text-slate-900 hover:bg-slate-200',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    };

    const sizes = {
      default: 'h-11 px-5 py-2',
      sm: 'h-9 rounded-lg px-4 text-sm',
      lg: 'h-12 rounded-xl px-8 text-base',
      icon: 'h-11 w-11',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
