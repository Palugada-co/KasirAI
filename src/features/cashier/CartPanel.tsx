import React, { useState } from 'react'
import {
  Trash2,
  Plus,
  Minus,
  UtensilsCrossed,
  ShoppingBag,
  Percent,
  FileText,
  X,
  CreditCard,
  AlertCircle,
  Tag,
} from 'lucide-react'
import { useCartStore } from '../../store/useCartStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { formatRupiah, cn } from '../../lib/utils'

interface CartPanelProps {
  onProceedToPayment: () => void
  onCloseMobileCart?: () => void
}

export const CartPanel: React.FC<CartPanelProps> = ({
  onProceedToPayment,
  onCloseMobileCart,
}) => {
  const {
    cartItems,
    orderType,
    tableNumber,
    customerName,
    discountRate,
    discountCode,
    taxRate,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateItemNote,
    clearCart,
    setOrderType,
    setTableNumber,
    setCustomerName,
    applyDiscount,
    getSubtotal,
    getDiscountAmount,
    getTaxAmount,
    getTotal,
    getTotalItems,
  } = useCartStore()

  const [activeNoteItemId, setActiveNoteItemId] = useState<string | null>(null)
  const [editingNote, setEditingNote] = useState<string>('')
  const [showDiscountModal, setShowDiscountModal] = useState<boolean>(false)
  const [customDiscountCode, setCustomDiscountCode] = useState<string>('')

  const subtotal = getSubtotal()
  const discountAmount = getDiscountAmount()
  const taxAmount = getTaxAmount()
  const total = getTotal()
  const totalItems = getTotalItems()

  const handleOpenNote = (productId: string, currentNote = '') => {
    setActiveNoteItemId(productId)
    setEditingNote(currentNote)
  }

  const handleSaveNote = (productId: string) => {
    updateItemNote(productId, editingNote)
    setActiveNoteItemId(null)
    setEditingNote('')
  }

  const handleSelectDiscountPreset = (rate: number, code: string) => {
    applyDiscount(rate, code)
    setShowDiscountModal(false)
  }

  return (
    <aside className="w-full h-full flex flex-col bg-white border-l border-[#E5E7EB]">
      {/* Header Panel */}
      <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-zinc-950">Pesanan Aktif</h2>
            <span className="bg-zinc-100 text-zinc-800 text-xs font-bold px-2 py-0.5 rounded-full font-mono">
              {totalItems} item
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">Rincian keranjang kasir</p>
        </div>

        <div className="flex items-center gap-1">
          {cartItems.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Kosongkan semua pesanan dalam keranjang?')) {
                  clearCart()
                }
              }}
              title="Kosongkan Keranjang"
              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {onCloseMobileCart && (
            <button
              onClick={onCloseMobileCart}
              className="lg:hidden p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Order Type & Table Selection */}
      <div className="p-3 bg-zinc-50 border-b border-[#E5E7EB] space-y-2.5">
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-200/70 rounded-xl">
          <button
            onClick={() => setOrderType('dine-in')}
            className={cn(
              'flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              orderType === 'dine-in'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            )}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Makan di Sini</span>
          </button>
          <button
            onClick={() => setOrderType('takeaway')}
            className={cn(
              'flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              orderType === 'takeaway'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            )}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Bungkus / Takeaway</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {orderType === 'dine-in' && (
            <div className="col-span-1">
              <input
                type="text"
                placeholder="No Meja"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full h-8 px-2.5 text-xs bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
              />
            </div>
          )}
          <div className={orderType === 'dine-in' ? 'col-span-2' : 'col-span-3'}>
            <input
              type="text"
              placeholder="Nama Pelanggan (opsional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full h-8 px-2.5 text-xs bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
            />
          </div>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mb-2.5">
              <ShoppingBag className="w-6 h-6 text-zinc-300" />
            </div>
            <p className="text-xs font-bold text-zinc-700">Keranjang Masih Kosong</p>
            <p className="text-[11px] text-zinc-400 mt-1 max-w-[200px]">
              Pilih produk di katalog untuk menambahkan pesanan ke keranjang
            </p>
          </div>
        ) : (
          cartItems.map((item) => {
            const isEditingThisNote = activeNoteItemId === item.product.id
            const itemTotal = item.product.price * item.quantity

            return (
              <div
                key={item.product.id}
                className="p-3 bg-white border border-zinc-200 rounded-xl space-y-2 shadow-2xs hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-zinc-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-zinc-900 leading-snug truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-zinc-500 font-medium">
                        {formatRupiah(item.product.price)}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-zinc-900 whitespace-nowrap">
                    {formatRupiah(itemTotal)}
                  </span>
                </div>

                {/* Note display or edit box */}
                {isEditingThisNote ? (
                  <div className="flex gap-1 pt-1">
                    <input
                      type="text"
                      value={editingNote}
                      onChange={(e) => setEditingNote(e.target.value)}
                      placeholder="Catatan pesanan (misal: less ice)"
                      className="flex-1 h-7 text-[11px] px-2 border border-zinc-300 rounded bg-zinc-50"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveNote(item.product.id)}
                      className="px-2 h-7 bg-zinc-900 text-white rounded text-[11px] font-medium"
                    >
                      Simpan
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-0.5">
                    <button
                      onClick={() => handleOpenNote(item.product.id, item.note || '')}
                      className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 hover:underline"
                    >
                      <FileText className="w-3 h-3 text-zinc-400" />
                      <span>{item.note ? `Catatan: ${item.note}` : '+ Catatan'}</span>
                    </button>
                  </div>
                )}

                {/* Quantity Controls */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
                  <span className="text-[10px] text-zinc-400">
                    Stok: {item.product.stock} {item.product.unit}
                  </span>

                  <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-white text-zinc-700 flex items-center justify-center hover:bg-zinc-200 transition-colors shadow-2xs"
                      aria-label="Kurangi"
                    >
                      {item.quantity === 1 ? (
                        <Trash2 className="w-3 h-3 text-red-500" />
                      ) : (
                        <Minus className="w-3 h-3" />
                      )}
                    </button>
                    <span className="w-6 text-center text-xs font-extrabold text-zinc-900 font-mono">
                      {item.quantity}
                    </span>
                    <button
                      disabled={item.quantity >= item.product.stock}
                      onClick={() => addToCart(item.product, 1)}
                      className="w-6 h-6 rounded bg-white text-zinc-700 flex items-center justify-center hover:bg-zinc-200 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs"
                      aria-label="Tambah"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Bill Calculations & Checkout Button */}
      <div className="p-4 border-t border-[#E5E7EB] bg-zinc-50/80 space-y-3">
        {/* Discounts & Promos row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-xs font-semibold text-zinc-700">Diskon / Promo:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {discountRate > 0 ? (
              <div className="flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                <span>{discountCode || `${discountRate}% OFF`}</span>
                <button
                  onClick={() => applyDiscount(0, '')}
                  className="hover:text-red-700 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDiscountModal(!showDiscountModal)}
                className="text-xs text-zinc-800 font-semibold underline hover:text-zinc-950"
              >
                + Pilih Diskon
              </button>
            )}
          </div>
        </div>

        {/* Quick Discount chips when expanded */}
        {showDiscountModal && (
          <div className="p-2.5 bg-white border border-zinc-200 rounded-xl space-y-2 animate-scale-up">
            <span className="text-[11px] text-zinc-400 font-medium block">Preset Diskon:</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { rate: 5, code: 'MEMBER5' },
                { rate: 10, code: 'HEMAT10' },
                { rate: 15, code: 'SPECIAL15' },
                { rate: 20, code: 'VIP20' },
              ].map((item) => (
                <button
                  key={item.rate}
                  onClick={() => handleSelectDiscountPreset(item.rate, item.code)}
                  className="py-1 px-1.5 text-center text-xs font-bold border border-zinc-200 rounded-lg hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  {item.rate}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="space-y-1.5 text-xs text-zinc-600 border-t border-zinc-200 pt-2.5">
          <div className="flex justify-between">
            <span>Subtotal ({totalItems} item):</span>
            <span className="font-semibold text-zinc-900">{formatRupiah(subtotal)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-amber-600 font-medium">
              <span>Diskon ({discountRate}%):</span>
              <span>-{formatRupiah(discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>PPN ({taxRate}%):</span>
            <span className="font-semibold text-zinc-900">{formatRupiah(taxAmount)}</span>
          </div>

          <div className="flex justify-between text-sm font-extrabold text-zinc-950 border-t border-zinc-200 pt-2">
            <span>Total Akhir:</span>
            <span className="text-base text-zinc-950">{formatRupiah(total)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button
          variant="primary"
          onClick={onProceedToPayment}
          disabled={cartItems.length === 0}
          className="w-full h-12 text-sm font-bold shadow-md gap-2"
        >
          <CreditCard className="w-4 h-4" />
          <span>Bayar {formatRupiah(total)}</span>
        </Button>
      </div>
    </aside>
  )
}
