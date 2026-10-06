import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, Category, StockAdjustment, AdjustmentType } from '../types'
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/mockData'

interface InventoryState {
  products: Product[]
  categories: Category[]
  adjustments: StockAdjustment[]

  // Product Actions
  addProduct: (product: Omit<Product, 'id'>) => Product
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  
  // Stock Adjustment Actions
  adjustStock: (
    productId: string,
    type: AdjustmentType,
    quantity: number,
    reason: string,
    performedBy: string
  ) => void
  decreaseStock: (productId: string, quantity: number) => void
  
  // Category Actions
  addCategory: (name: string) => Category
  
  // Reset
  resetToDefault: () => void
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      adjustments: [],

      addProduct: (productData) => {
        const id = 'prod-' + Date.now()
        const newProduct: Product = {
          ...productData,
          id,
        }
        set((state) => ({
          products: [newProduct, ...state.products],
        }))
        return newProduct
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }))
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }))
      },

      adjustStock: (productId, type, quantity, reason, performedBy) => {
        const product = get().products.find((p) => p.id === productId)
        if (!product) return

        let newStock = product.stock
        if (type === 'in') {
          newStock = product.stock + quantity
        } else if (type === 'out') {
          newStock = Math.max(0, product.stock - quantity)
        } else if (type === 'correction') {
          newStock = Math.max(0, quantity)
        }

        const adjustmentRecord: StockAdjustment = {
          id: 'adj-' + Date.now(),
          productId,
          productName: product.name,
          type,
          quantity,
          previousStock: product.stock,
          newStock,
          reason,
          timestamp: new Date().toISOString(),
          performedBy,
        }

        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, stock: newStock } : p
          ),
          adjustments: [adjustmentRecord, ...state.adjustments],
        }))
      },

      decreaseStock: (productId, quantity) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id === productId) {
              const updatedStock = Math.max(0, p.stock - quantity)
              return { ...p, stock: updatedStock }
            }
            return p
          }),
        }))
      },

      addCategory: (name) => {
        const slug = name.toLowerCase().replace(/\s+/g, '-')
        const id = 'cat-' + Date.now()
        const newCat: Category = { id, name, slug }
        set((state) => ({
          categories: [...state.categories, newCat],
        }))
        return newCat
      },

      resetToDefault: () => {
        set({
          products: INITIAL_PRODUCTS,
          categories: INITIAL_CATEGORIES,
          adjustments: [],
        })
      },
    }),
    {
      name: 'kasirai-inventory-storage',
    }
  )
)
