import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer rounded-lg'

    const variants = {
      primary: 'bg-[#18181B] text-white hover:bg-zinc-800 shadow-sm active:scale-[0.99]',
      secondary: 'bg-[#F4F4F5] text-[#111827] hover:bg-zinc-200 active:scale-[0.99]',
      outline: 'border border-[#E5E7EB] bg-white text-[#111827] hover:bg-zinc-50 active:scale-[0.99]',
      ghost: 'text-[#111827] hover:bg-zinc-100',
      danger: 'bg-[#EF4444] text-white hover:bg-red-600 shadow-sm active:scale-[0.99]',
    }

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
      icon: 'h-10 w-10 p-0',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
