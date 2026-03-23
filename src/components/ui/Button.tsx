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
      default: 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.15)] ring-1 ring-zinc-900/5',
      outline: 'border border-zinc-200 bg-white/50 hover:bg-zinc-50 text-zinc-700 hover:border-zinc-300 shadow-sm hover:shadow',
      ghost: 'bg-transparent hover:bg-zinc-100/80 text-zinc-600 hover:text-zinc-900',
      secondary: 'bg-zinc-100/80 text-zinc-900 hover:bg-zinc-200 ring-1 ring-zinc-200/50',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100 ring-1 ring-red-100',
    };

    const sizes = {
      default: 'h-10 px-5 py-2 text-[13px]',
      sm: 'h-8 rounded-lg px-3 text-xs',
      lg: 'h-12 rounded-xl px-8 text-sm',
      icon: 'h-10 w-10',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
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
