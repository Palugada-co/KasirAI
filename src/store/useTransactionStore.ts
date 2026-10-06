import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Transaction, CashierShift, PaymentMethod } from '../types'
import { INITIAL_TRANSACTIONS, INITIAL_SHIFT } from '../data/mockData'
import { useInventoryStore } from './useInventoryStore'

interface TransactionState {
  transactions: Transaction[]
  activeShift: CashierShift

  createTransaction: (data: Omit<Transaction, 'id' | 'orderNumber' | 'date' | 'status'>) => Transaction
  startShift: (startingCash: number, cashierName: string) => void
  closeShift: () => void
  getTransactionById: (id: string) => Transaction | undefined
  getTodayTransactions: () => Transaction[]
  getTodayTotalSales: () => number
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: INITIAL_TRANSACTIONS,
      activeShift: INITIAL_SHIFT,

      createTransaction: (data) => {
        const orderIndex = get().transactions.length + 101
        const id = `TRX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(get().transactions.length + 1).padStart(3, '0')}`
        const orderNumber = `#ORD-${orderIndex}`
        const date = new Date().toISOString()

        const newTransaction: Transaction = {
          ...data,
          id,
          orderNumber,
          date,
          status: 'completed',
        }

        // 1. Decrement inventory stock
        const decreaseStock = useInventoryStore.getState().decreaseStock
        data.items.forEach((item) => {
          decreaseStock(item.product.id, item.quantity)
        })

        // 2. Update active shift stats
        const currentShift = get().activeShift
        let cashInc = 0
        let qrisInc = 0
        let cardInc = 0

        if (data.paymentMethod === 'cash') cashInc = data.total
        else if (data.paymentMethod === 'qris') qrisInc = data.total
        else if (data.paymentMethod === 'card') cardInc = data.total

        const updatedShift: CashierShift = {
          ...currentShift,
          totalSales: currentShift.totalSales + data.total,
          cashSales: currentShift.cashSales + cashInc,
          qrisSales: currentShift.qrisSales + qrisInc,
          cardSales: currentShift.cardSales + cardInc,
          transactionCount: currentShift.transactionCount + 1,
        }

        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
          activeShift: updatedShift,
        }))

        return newTransaction
      },

      startShift: (startingCash, cashierName) => {
        const newShift: CashierShift = {
          id: 'SHIFT-' + Date.now(),
          cashierId: 'usr-1',
          cashierName,
          startTime: new Date().toISOString(),
          startingCash,
          totalSales: 0,
          cashSales: 0,
          qrisSales: 0,
          cardSales: 0,
          transactionCount: 0,
          status: 'open',
        }
        set({ activeShift: newShift })
      },

      closeShift: () => {
        set((state) => ({
          activeShift: {
            ...state.activeShift,
            endTime: new Date().toISOString(),
            status: 'closed',
          },
        }))
      },

      getTransactionById: (id) => {
        return get().transactions.find((t) => t.id === id)
      },

      getTodayTransactions: () => {
        const todayStr = new Date().toISOString().slice(0, 10)
        return get().transactions.filter((t) => t.date.startsWith(todayStr))
      },

      getTodayTotalSales: () => {
        return get().getTodayTransactions().reduce((sum, t) => sum + t.total, 0)
      },
    }),
    {
      name: 'kasirai-transaction-storage',
    }
  )
)
