import React from 'react'
import { Transaction } from '../../types'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { formatRupiah, formatDate } from '../../lib/utils'
import { Receipt, Eye, Utensils, ShoppingBag } from 'lucide-react'

interface RecentTransactionsProps {
  transactions: Transaction[]
  onViewReceipt: (transaction: Transaction) => void
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  onViewReceipt,
}) => {
  const recentList = transactions.slice(0, 5)

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-zinc-950">Transaksi Terkini</h3>
          <p className="text-xs text-zinc-500">5 riwayat pembayaran terakhir di kasir</p>
        </div>
        <div className="text-xs font-semibold text-zinc-500">
          Total: {transactions.length} Transaksi
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">No. Order</th>
              <th className="py-2.5 px-3">Waktu</th>
              <th className="py-2.5 px-3">Menu Pesanan</th>
              <th className="py-2.5 px-3">Tipe / Meja</th>
              <th className="py-2.5 px-3">Metode</th>
              <th className="py-2.5 px-3">Total Bayar</th>
              <th className="py-2.5 px-3 text-right">Struk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700">
            {recentList.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-400">
                  Belum ada transaksi hari ini
                </td>
              </tr>
            ) : (
              recentList.map((trx) => {
                const totalItemCount = trx.items.reduce((s, i) => s + i.quantity, 0)
                const itemsSummary = trx.items
                  .map((i) => `${i.quantity}x ${i.product.name}`)
                  .join(', ')

                return (
                  <tr key={trx.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-zinc-900">
                      {trx.orderNumber}
                    </td>

                    <td className="py-3 px-3 text-zinc-500 whitespace-nowrap">
                      {formatDate(trx.date)}
                    </td>

                    <td className="py-3 px-3 max-w-[200px]">
                      <div className="truncate font-medium text-zinc-900" title={itemsSummary}>
                        {itemsSummary}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {totalItemCount} item
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-zinc-700 font-medium">
                        {trx.orderType === 'dine-in' ? (
                          <>
                            <Utensils className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Meja {trx.tableNumber || '-'}</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Takeaway</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono uppercase font-bold text-[11px] bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded">
                        {trx.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-extrabold text-zinc-950">
                      {formatRupiah(trx.total)}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewReceipt(trx)}
                        className="h-7 px-2.5 text-xs text-zinc-700 hover:text-zinc-950"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-zinc-500" />
                        <span>Struk</span>
                      </Button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
