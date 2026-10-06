import React, { useState, useEffect } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Product, AdjustmentType } from '../../types'
import { useInventoryStore } from '../../store/useInventoryStore'
import { useUserStore } from '../../store/useUserStore'
import { useToast } from '../../components/shared/Toast'
import { StockBadge } from '../../components/ui/StockBadge'
import { cn } from '../../lib/utils'
import { PlusCircle, MinusCircle, RefreshCw, CheckCircle2 } from 'lucide-react'

interface StockAdjustmentModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { adjustStock } = useInventoryStore()
  const { user } = useUserStore()
  const { showToast } = useToast()

  const [type, setType] = useState<AdjustmentType>('in')
  const [quantity, setQuantity] = useState<string>('10')
  const [reason, setReason] = useState<string>('Restock barang dari supplier')

  useEffect(() => {
    if (isOpen) {
      setQuantity('10')
      setType('in')
      setReason('Restock barang dari supplier')
    }
  }, [isOpen])

  if (!product) return null

  const parsedQty = parseInt(quantity, 10) || 0

  let previewNewStock = product.stock
  if (type === 'in') {
    previewNewStock = product.stock + parsedQty
  } else if (type === 'out') {
    previewNewStock = Math.max(0, product.stock - parsedQty)
  } else if (type === 'correction') {
    previewNewStock = Math.max(0, parsedQty)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (parsedQty <= 0 && type !== 'correction') {
      showToast('Jumlah tidak valid', 'Masukkan kuantitas lebih dari 0', 'error')
      return
    }

    adjustStock(
      product.id,
      type,
      parsedQty,
      reason,
      user?.name || 'Staff Inventori'
    )

    showToast(
      'Stok Berhasil Disesuaikan',
      `${product.name}: stok sekarang menjadi ${previewNewStock} ${product.unit}`,
      'success'
    )
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Penyesuaian Stok Cepat"
      description={`Update kuantitas stok barang untuk ${product.name}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product summary card */}
        <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-200">
          <div className="flex items-center gap-2.5">
            <img
              src={product.image}
              alt={product.name}
              className="w-10 h-10 rounded-lg object-cover bg-zinc-200"
            />
            <div>
              <h4 className="text-xs font-bold text-zinc-900 leading-tight">
                {product.name}
              </h4>
              <p className="text-[11px] text-zinc-500">
                SKU: {product.sku} • Min: {product.minStock} {product.unit}
              </p>
            </div>
          </div>
          <StockBadge stock={product.stock} minStock={product.minStock} unit={product.unit} />
        </div>

        {/* Adjustment Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Tipe Penyesuaian
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setType('in')
                setReason('Restock barang dari supplier')
              }}
              className={cn(
                'py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer',
                type === 'in'
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
              )}
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Masuk (+)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('out')
                setReason('Barang rusak / kadaluarsa / terbuang')
              }}
              className={cn(
                'py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer',
                type === 'out'
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
              )}
            >
              <MinusCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Keluar (-)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('correction')
                setReason('Koreksi hasil opname fisik gudang')
                setQuantity(product.stock.toString())
              }}
              className={cn(
                'py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer',
                type === 'correction'
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
              )}
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Koreksi</span>
            </button>
          </div>
        </div>

        {/* Quantity Field */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            {type === 'correction' ? 'Stok Fisik Baru Aktual' : 'Jumlah Perubahan'} ({product.unit})
          </label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0"
            className="text-base font-bold font-mono"
            autoFocus
          />
        </div>

        {/* Reason / Notes */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Alasan / Catatan Penyesuaian
          </label>
          <Input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Contoh: Pembelian baru dari supplier Jaya"
          />
        </div>

        {/* Stock Status Simulation Preview */}
        <div className="p-3 bg-zinc-100/80 rounded-xl border border-zinc-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-zinc-500 block">Simulasi Perubahan Status:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-zinc-500">{product.stock} {product.unit}</span>
              <span className="text-zinc-400 font-bold">→</span>
              <span className="font-mono font-bold text-zinc-950 text-sm">
                {previewNewStock} {product.unit}
              </span>
            </div>
          </div>

          <StockBadge stock={previewNewStock} minStock={product.minStock} unit={product.unit} />
        </div>

        {/* Form Actions */}
        <div className="flex gap-2 pt-2 border-t border-zinc-100">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" className="flex-1 font-semibold">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            <span>Simpan Perubahan</span>
          </Button>
        </div>
      </form>
    </Modal>
  )
}
