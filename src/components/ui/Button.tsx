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
      default: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_2px_10px_rgba(79,70,229,0.2),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_4px_14px_rgba(79,70,229,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] ring-1 ring-indigo-600/10',
      outline: 'border border-zinc-200/80 bg-white/60 backdrop-blur-md hover:bg-zinc-50 text-zinc-700 hover:border-zinc-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]',
      ghost: 'bg-transparent hover:bg-zinc-100/80 text-zinc-600 hover:text-zinc-900',
      secondary: 'bg-zinc-100/80 text-zinc-900 hover:bg-zinc-200 ring-1 ring-zinc-200/50 shadow-sm',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100 ring-1 ring-red-100 shadow-sm',
    };

    const sizes = {
      default: 'h-10 px-5 py-2 text-[14px]',
      sm: 'h-8 rounded-lg px-3 text-[13px]',
      lg: 'h-12 rounded-xl px-8 text-[15px]',
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
