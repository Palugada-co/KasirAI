import { create } from 'zustand'
import { CartItem, Product, OrderType } from '../types'

interface CartState {
  cartItems: CartItem[]
  orderType: OrderType
  tableNumber: string
  customerName: string
  discountRate: number // percent e.g. 10
  discountCode: string
  taxRate: number // default 11% (PPN Indonesia)
  note: string

  // Cart operations
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateItemNote: (productId: string, note: string) => void
  clearCart: () => void

  // Metadata operations
  setOrderType: (orderType: OrderType) => void
  setTableNumber: (tableNumber: string) => void
  setCustomerName: (customerName: string) => void
  applyDiscount: (rate: number, code?: string) => void
  setTaxRate: (rate: number) => void
  setNote: (note: string) => void

  // Computed values
  getSubtotal: () => number
  getDiscountAmount: () => number
  getTaxAmount: () => number
  getTotal: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  orderType: 'dine-in',
  tableNumber: '01',
  customerName: '',
  discountRate: 0,
  discountCode: '',
  taxRate: 11,
  note: '',

  addToCart: (product, quantity = 1) => {
    // Check if product is out of stock
    if (product.stock <= 0) return

    set((state) => {
      const existingIndex = state.cartItems.findIndex(
        (item) => item.product.id === product.id
      )

      if (existingIndex > -1) {
        const currentQty = state.cartItems[existingIndex].quantity
        // Don't exceed product available stock
        const newQty = Math.min(product.stock, currentQty + quantity)
        const updated = [...state.cartItems]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        }
        return { cartItems: updated }
      }

      return {
        cartItems: [...state.cartItems, { product, quantity }],
      }
    })
  },

  removeFromCart: (productId) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.product.id !== productId),
    }))
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }

    set((state) => ({
      cartItems: state.cartItems.map((item) => {
        if (item.product.id === productId) {
          const validQty = Math.min(item.product.stock, quantity)
          return { ...item, quantity: validQty }
        }
        return item
      }),
    }))
  },

  updateItemNote: (productId, note) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.product.id === productId ? { ...item, note } : item
      ),
    }))
  },

  clearCart: () => {
    set({
      cartItems: [],
      discountRate: 0,
      discountCode: '',
      customerName: '',
      tableNumber: '01',
      note: '',
    })
  },

  setOrderType: (orderType) => set({ orderType }),
  setTableNumber: (tableNumber) => set({ tableNumber }),
  setCustomerName: (customerName) => set({ customerName }),
  applyDiscount: (discountRate, discountCode = '') =>
    set({ discountRate, discountCode }),
  setTaxRate: (taxRate) => set({ taxRate }),
  setNote: (note) => set({ note }),

  getSubtotal: () => {
    return get().cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  },

  getDiscountAmount: () => {
    const subtotal = get().getSubtotal()
    return Math.round((subtotal * get().discountRate) / 100)
  },

  getTaxAmount: () => {
    const subtotal = get().getSubtotal()
    const discount = get().getDiscountAmount()
    const taxableAmount = Math.max(0, subtotal - discount)
    return Math.round((taxableAmount * get().taxRate) / 100)
  },

  getTotal: () => {
    const subtotal = get().getSubtotal()
    const discount = get().getDiscountAmount()
    const tax = get().getTaxAmount()
    return Math.max(0, subtotal - discount + tax)
  },

  getTotalItems: () => {
    return get().cartItems.reduce((sum, item) => sum + item.quantity, 0)
  },
}))
