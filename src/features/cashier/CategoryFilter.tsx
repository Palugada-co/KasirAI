import React from 'react'
import { Category } from '../../types'
import {
  Grid,
  Coffee,
  Utensils,
  Cookie,
  Sparkles,
  ShoppingBag,
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onSelectCategory: (categoryId: string) => void
  productCounts?: Record<string, number>
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  productCounts = {},
}) => {
  const getIcon = (slug: string) => {
    switch (slug) {
      case 'all':
        return Grid
      case 'beverage':
        return Coffee
      case 'food':
        return Utensils
      case 'snack':
        return Cookie
      case 'package':
        return Sparkles
      case 'retail':
        return ShoppingBag
      default:
        return Grid
    }
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
      {categories.map((cat) => {
        const IconComponent = getIcon(cat.slug)
        const isSelected = selectedCategory === cat.id
        const count = productCounts[cat.id]

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer',
              isSelected
                ? 'bg-[#18181B] text-white border-zinc-900 shadow-xs'
                : 'bg-white text-zinc-600 border-[#E5E7EB] hover:border-zinc-300 hover:text-zinc-950 hover:bg-zinc-50'
            )}
          >
            <IconComponent
              className={cn(
                'w-3.5 h-3.5',
                isSelected ? 'text-white' : 'text-zinc-400'
              )}
            />
            <span>{cat.name}</span>
            {count !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium',
                  isSelected
                    ? 'bg-zinc-800 text-zinc-300'
                    : 'bg-zinc-100 text-zinc-500'
                )}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
