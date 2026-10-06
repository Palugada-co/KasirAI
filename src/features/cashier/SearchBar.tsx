import React, { useEffect, useRef } from 'react'
import { Search, X, Barcode } from 'lucide-react'
import { cn } from '../../lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Cari nama produk, SKU, atau barcode...',
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // Listen to Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className={cn('relative flex items-center w-full', className)}>
      <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-10 pr-24 text-sm bg-white border border-[#E5E7EB] rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-zinc-950 transition-all shadow-2xs"
      />
      <div className="absolute right-3 flex items-center gap-1.5">
        {value ? (
          <button
            onClick={() => onChange('')}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded font-mono">
            <Barcode className="w-3 h-3 text-zinc-400" />
            <span>Ctrl+K</span>
          </div>
        )}
      </div>
    </div>
  )
}
