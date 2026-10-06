export type UserRole = 'cashier' | 'admin' | 'manager'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  storeName: string
  avatar?: string
}

export interface AuthSession {
  token: string | null
  user: User | null
  isAuthenticated: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
}

export type StockStatus = 'in-stock' | 'limited' | 'out-of-stock'

export interface Product {
  id: string
  name: string
  sku: string
  barcode: string
  categoryId: string
  categoryName: string
  buyPrice: number
  price: number
  stock: number
  minStock: number
  unit: string
  image: string
  description?: string
  isActive: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  note?: string
}

export type PaymentMethod = 'cash' | 'qris' | 'card' | 'transfer'
export type OrderType = 'dine-in' | 'takeaway'

export interface Transaction {
  id: string
  orderNumber: string
  date: string
  items: CartItem[]
  subtotal: number
  discountRate: number // percent e.g. 10
  discountAmount: number
  discountCode?: string
  taxRate: number // percent e.g. 11
  taxAmount: number
  total: number
  paymentMethod: PaymentMethod
  amountPaid: number
  changeAmount: number
  orderType: OrderType
  tableNumber?: string
  customerName?: string
  cashierName: string
  status: 'completed' | 'refunded' | 'cancelled'
}

export interface CashierShift {
  id: string
  cashierId: string
  cashierName: string
  startTime: string
  endTime?: string
  startingCash: number
  totalSales: number
  cashSales: number
  qrisSales: number
  cardSales: number
  transactionCount: number
  status: 'open' | 'closed'
}

export type AdjustmentType = 'in' | 'out' | 'correction'

export interface StockAdjustment {
  id: string
  productId: string
  productName: string
  type: AdjustmentType
  quantity: number
  previousStock: number
  newStock: number
  reason: string
  timestamp: string
  performedBy: string
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  content: string
  timestamp: string
  isStreaming?: boolean
  metadata?: {
    type?: 'sales-summary' | 'stock-alert' | 'recommendation' | 'general'
    actionLink?: string
    actionLabel?: string
    payload?: any
  }
}

export interface QuickPrompt {
  id: string
  label: string
  prompt: string
  icon?: string
  category: 'sales' | 'inventory' | 'promo' | 'shift'
}
