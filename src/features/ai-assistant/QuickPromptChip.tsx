import React from 'react'
import { QuickPrompt } from '../../types'
import { TrendingUp, AlertTriangle, Flame, Sparkles, Clock } from 'lucide-react'
import { cn } from '../../lib/utils'

interface QuickPromptChipProps {
  prompts: QuickPrompt[]
  onSelectPrompt: (promptText: string) => void
  disabled?: boolean
}

export const QuickPromptChip: React.FC<QuickPromptChipProps> = ({
  prompts,
  onSelectPrompt,
  disabled = false,
}) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'sales':
        return TrendingUp
      case 'inventory':
        return AlertTriangle
      case 'promo':
        return Sparkles
      case 'shift':
        return Clock
      default:
        return Flame
    }
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {prompts.map((p) => {
        const IconComponent = getIcon(p.category)
        return (
          <button
            key={p.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(p.prompt)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all shrink-0 cursor-pointer',
              'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 active:scale-[0.98]',
              'disabled:opacity-50 disabled:pointer-events-none'
            )}
          >
            <IconComponent className="w-3.5 h-3.5 text-zinc-500" />
            <span>{p.label}</span>
          </button>
        )
      })}
    </div>
  )
}
