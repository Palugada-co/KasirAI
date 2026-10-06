import React, { useState, useMemo } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { StatCards } from '../features/dashboard/StatCards'
import { SalesChart } from '../features/dashboard/SalesChart'
import { RecentTransactions } from '../features/dashboard/RecentTransactions'
import { ReceiptModal } from '../features/cashier/ReceiptModal'
import { useTransactionStore } from '../store/useTransactionStore'
import { useInventoryStore } from '../store/useInventoryStore'
import { Transaction } from '../types'

export const DashboardPage: React.FC = () => {
  const { transactions, activeShift, getTodayTotalSales } = useTransactionStore()
  const { products } = useInventoryStore()

  const [receiptTransaction, setReceiptTransaction] = useState<Transaction | null>(null)

  const todayTotalSales = getTodayTotalSales()
  const transactionCount = transactions.length
  const averageOrderValue = transactionCount > 0 ? Math.round(todayTotalSales / transactionCount) : 0

  // Find top selling product from transactions
  const topSellingProduct = useMemo(() => {
    const counts: Record<string, { name: string; qty: number }> = {}
    transactions.forEach((t) => {
      t.items.forEach((item) => {
        if (!counts[item.product.id]) {
          counts[item.product.id] = { name: item.product.name, qty: 0 }
        }
        counts[item.product.id].qty += item.quantity
      })
    })

    const list = Object.values(counts)
    if (list.length === 0) return null
    return list.sort((a, b) => b.qty - a.qty)[0]
  }, [transactions])

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stock <= p.minStock).length
  }, [products])

  return (
    <PageContainer
      title="Dashboard & Analisis Penjualan"
      subtitle="Ringkasan performa finansial, tren omzet, dan riwayat pesanan"
    >
      <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Metric Cards */}
        <StatCards
          totalSales={todayTotalSales}
          transactionCount={transactionCount}
          averageOrderValue={averageOrderValue}
          topSellingProduct={topSellingProduct}
          lowStockCount={lowStockCount}
        />

        {/* Sales Chart with Recharts */}
        <SalesChart />

        {/* 5 Recent Transactions Table */}
        <RecentTransactions
          transactions={transactions}
          onViewReceipt={(trx) => setReceiptTransaction(trx)}
        />
      </div>

      {/* Receipt Modal Preview */}
      <ReceiptModal
        isOpen={!!receiptTransaction}
        onClose={() => setReceiptTransaction(null)}
        transaction={receiptTransaction}
      />
    </PageContainer>
  )
}
