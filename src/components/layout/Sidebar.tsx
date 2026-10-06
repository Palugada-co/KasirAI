import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Store,
  Boxes,
  LayoutDashboard,
  Bot,
  LogOut,
  Sparkles,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import { useUserStore } from '../../store/useUserStore'
import { useTransactionStore } from '../../store/useTransactionStore'
import { formatRupiah, cn } from '../../lib/utils'

interface SidebarProps {
  onOpenShiftModal?: () => void
  isMobileOpen?: boolean
  setIsMobileOpen?: (open: boolean) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenShiftModal,
  isMobileOpen = false,
  setIsMobileOpen,
}) => {
  const { user, logout } = useUserStore()
  const { activeShift } = useTransactionStore()

  const navItems = [
    {
      to: '/cashier',
      icon: Store,
      label: 'Kasir POS',
      badge: 'Ctrl+K',
    },
    {
      to: '/inventory',
      icon: Boxes,
      label: 'Inventori & Stok',
    },
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard & Omzet',
    },
    {
      to: '/ai-assistant',
      icon: Bot,
      label: 'KasirAI Copilot',
      highlight: true,
      badge: 'OpenClaw',
    },
  ]

  const handleLinkClick = () => {
    if (setIsMobileOpen) setIsMobileOpen(false)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#E5E7EB] flex flex-col transition-transform duration-200 lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#18181B] flex items-center justify-center text-white font-bold shadow-xs">
              <span className="text-base tracking-tight font-extrabold">K</span>
              <Sparkles className="w-3.5 h-3.5 -ml-0.5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-zinc-950">KasirAI</span>
                <span className="text-[10px] bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded font-mono font-medium">v1.0</span>
              </div>
              <p className="text-[11px] text-zinc-500 truncate max-w-[140px]">
                {user?.storeName || 'POS System'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Menu Utama
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-[#18181B] text-white shadow-xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100',
                  item.highlight && !isActive && 'text-zinc-900 font-semibold'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive
                          ? 'text-white'
                          : item.highlight
                          ? 'text-zinc-900'
                          : 'text-zinc-500 group-hover:text-zinc-900'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        'text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors',
                        isActive
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Active Shift Card */}
          <div className="pt-5 pb-2">
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Shift Aktif</span>
                </div>
                {onOpenShiftModal && (
                  <button
                    onClick={onOpenShiftModal}
                    className="text-[11px] text-zinc-500 hover:text-zinc-900 underline font-medium cursor-pointer"
                  >
                    Detail
                  </button>
                )}
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Kasir:</span>
                  <span className="font-medium text-zinc-900">{activeShift.cashierName}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Omzet Shift:</span>
                  <span className="font-semibold text-emerald-600">
                    {formatRupiah(activeShift.totalSales)}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Transaksi:</span>
                  <span className="font-medium text-zinc-800">{activeShift.transactionCount} order</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile & Logout Footer */}
        <div className="p-3 border-t border-[#E5E7EB] bg-white">
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-zinc-700 text-xs">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || 'K'
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-900 truncate">{user?.name || 'Kasir'}</p>
                <p className="text-[10px] text-zinc-500 capitalize truncate">{user?.role || 'Staff'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Keluar / Logout"
              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
