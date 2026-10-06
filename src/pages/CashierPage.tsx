import React, { useState, useMemo } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { SearchBar } from '../features/cashier/SearchBar'
import { CategoryFilter } from '../features/cashier/CategoryFilter'
import { ProductGrid } from '../features/cashier/ProductGrid'
import { CartPanel } from '../features/cashier/CartPanel'
import { PaymentModal } from '../features/cashier/PaymentModal'
import { ReceiptModal } from '../features/cashier/ReceiptModal'
import { useInventoryStore } from '../store/useInventoryStore'
import { useCartStore } from '../store/useCartStore'
import { useScanner } from '../hooks/useScanner'
import { useToast } from '../components/shared/Toast'
import { Product, Transaction } from '../types'
import { X, Sparkles, ShoppingBag } from 'lucide-react'

export const CashierPage: React.FC = () => {
  const { products, categories } = useInventoryStore()
  const { cartItems, addToCart } = useCartStore()
  const { showToast } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [receiptTransaction, setReceiptTransaction] = useState<Transaction | null>(null)

  // Hardware barcode scanner listener
  useScanner({
    onScan: (barcode) => {
      const matched = products.find(
        (p) => p.barcode === barcode || p.sku.toLowerCase() === barcode.toLowerCase()
      )
      if (matched) {
        if (matched.stock > 0) {
          addToCart(matched, 1)
          showToast('Produk Discan!', `${matched.name} ditambahkan ke keranjang`, 'success')
        } else {
          showToast('Stok Habis', `${matched.name} tidak memiliki sisa stok`, 'error')
        }
      } else {
        showToast('Barcode Tidak Dikenali', `Barcode: ${barcode}`, 'info')
      }
    },
  })

  // Filter products by category & search query
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        selectedCategory === 'all' || p.categoryId === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const matchSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.barcode.includes(query)

      return matchCategory && matchSearch
    })
  }, [products, selectedCategory, searchQuery])

  // Count items per category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length }
    categories.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = products.filter((p) => p.categoryId === cat.id).length
      }
    })
    return counts
  }, [products, categories])

  // Cart quantity lookup
  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {}
    cartItems.forEach((item) => {
      map[item.product.id] = item.quantity
    })
    return map
  }, [cartItems])

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
  }

  const handlePaymentSuccess = (transaction: Transaction) => {
    setIsPaymentModalOpen(false)
    setReceiptTransaction(transaction)
    showToast('Transaksi Berhasil!', `Order ${transaction.orderNumber} selesai`, 'success')
  }

  return (
    <PageContainer
      title="Kasir POS KasirAI"
      subtitle="Tekan Ctrl+K untuk mencari produk secara cepat"
      onToggleCart={() => setIsMobileCartOpen(!isMobileCartOpen)}
    >
      <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Left Side: Catalog, Search, Categories, Grid */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto">
          {/* Top Search & Filter Bar */}
          <div className="space-y-3 mb-5">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Cari nama menu, minuman, atau scan barcode..."
            />

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              productCounts={productCounts}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid
              products={filteredProducts}
              cartQuantities={cartQuantities}
              onAddToCart={handleAddToCart}
              onClearFilters={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
            />
          </div>
        </div>

        {/* Right Side: Desktop Cart Panel */}
        <div className="hidden lg:block w-96 xl:w-[420px] shrink-0 h-[calc(100vh-4rem)] sticky top-16">
          <CartPanel
            onProceedToPayment={() => setIsPaymentModalOpen(true)}
          />
        </div>

        {/* Mobile Cart Drawer Overlay */}
        {isMobileCartOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setIsMobileCartOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 max-w-full w-full sm:w-96 bg-white shadow-2xl flex flex-col z-10 animate-slide-left">
              <CartPanel
                onProceedToPayment={() => {
                  setIsMobileCartOpen(false)
                  setIsPaymentModalOpen(true)
                }}
                onCloseMobileCart={() => setIsMobileCartOpen(false)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* Receipt Preview & Thermal Print Modal */}
      <ReceiptModal
        isOpen={!!receiptTransaction}
        onClose={() => setReceiptTransaction(null)}
        transaction={receiptTransaction}
      />
    </PageContainer>
  )
}
