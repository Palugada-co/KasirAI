import React from 'react'
import { cn } from '../../lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverEffect = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-[#E5E7EB] shadow-xs transition-all',
        hoverEffect && 'hover:shadow-md hover:border-zinc-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
