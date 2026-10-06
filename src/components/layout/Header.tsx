import React, { useState, useEffect } from 'react'
import {
  Menu,
  Clock,
  Sparkles,
  Search,
  ShoppingCart,
  Bot,
  Layers,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { useCartStore } from '../../store/useCartStore'
import { useTransactionStore } from '../../store/useTransactionStore'
import { formatRupiah } from '../../lib/utils'

interface HeaderProps {
  onToggleMobileMenu: () => void
  onOpenSearch?: () => void
  onOpenShiftModal?: () => void
  onToggleCart?: () => void
  title?: string
  subtitle?: string
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  onOpenSearch,
  onOpenShiftModal,
  onToggleCart,
  title = 'Kasir AI',
  subtitle,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const totalCartItems = useCartStore((state) => state.getTotalItems())
  const cartTotal = useCartStore((state) => state.getTotal())
  const { activeShift } = useTransactionStore()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-bold text-zinc-950 leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-zinc-500 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      {/* Right side: Live Time, Search shortcut, Shift info, Mobile Cart */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Live Clock */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-600">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>{formattedDate}</span>
          <span className="font-mono font-bold text-zinc-900 border-l border-zinc-200 pl-2">
            {formattedTime}
          </span>
        </div>

        {/* Global Search Shortcut trigger */}
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-400 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Cari produk...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-zinc-200 rounded font-mono shadow-2xs text-zinc-600">
              Ctrl+K
            </kbd>
          </button>
        )}

        {/* Shift Badge / Button */}
        {onOpenShiftModal && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenShiftModal}
            className="hidden sm:flex text-xs font-semibold gap-1.5 border-zinc-200"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Shift #{activeShift.id.slice(-4)}</span>
          </Button>
        )}

        {/* Mobile Cart Button Toggle */}
        {onToggleCart && (
          <Button
            variant="primary"
            size="sm"
            onClick={onToggleCart}
            className="lg:hidden relative gap-2 text-xs"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{formatRupiah(cartTotal)}</span>
            {totalCartItems > 0 && (
              <span className="bg-amber-400 text-zinc-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Button>
        )}
      </div>
    </header>
  )
}
