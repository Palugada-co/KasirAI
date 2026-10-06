import React from 'react'
import { Card } from '../../components/ui/Card'
import { formatRupiah } from '../../lib/utils'
import {
  TrendingUp,
  Receipt,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
  Boxes,
} from 'lucide-react'

interface StatCardsProps {
  totalSales: number
  transactionCount: number
  averageOrderValue: number
  topSellingProduct: { name: string; qty: number } | null
  lowStockCount: number
}

export const StatCards: React.FC<StatCardsProps> = ({
  totalSales,
  transactionCount,
  averageOrderValue,
  topSellingProduct,
  lowStockCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Total Sales */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">Omzet Penjualan Hari Ini</span>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-zinc-950 tracking-tight">
            {formatRupiah(totalSales)}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% vs kemarin</span>
          </div>
        </div>
      </Card>

      {/* Metric 2: Transactions */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">Total Transaksi</span>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-zinc-950 tracking-tight">
            {transactionCount} <span className="text-sm font-normal text-zinc-500">struk</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-500">
            <span>Rata-rata: </span>
            <span className="font-semibold text-zinc-900">{formatRupiah(averageOrderValue)}</span>
          </div>
        </div>
      </Card>

      {/* Metric 3: Top Selling Item */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">Menu Paling Laris</span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-base font-bold text-zinc-900 truncate">
            {topSellingProduct?.name || 'Kopi Susu Aren'}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-500">
            <span className="font-semibold text-zinc-900">
              {topSellingProduct?.qty || 12} terjual
            </span>{' '}
            hari ini
          </div>
        </div>
      </Card>

      {/* Metric 4: Stock Alert */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">Peringatan Stok</span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-700">
            <Boxes className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-zinc-950 tracking-tight">
            {lowStockCount} <span className="text-sm font-normal text-zinc-500">item</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-600 font-semibold">
            <span>Perlu restock segera</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
