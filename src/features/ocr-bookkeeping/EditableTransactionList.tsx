import React from 'react'
import { OCRExtractedItem } from './types'
import { formatRupiah } from '../../lib/utils'
import { Button } from '../../components/ui/Button'
import { Plus, Trash2, RotateCcw, AlertCircle } from 'lucide-react'

interface EditableTransactionListProps {
  items: OCRExtractedItem[]
  onUpdateItem: (id: string, updates: Partial<OCRExtractedItem>) => void
  onDeleteItem: (id: string) => void
  onAddItem: () => void
  onReset: () => void
  totalAmount: number
}

export const EditableTransactionList: React.FC<EditableTransactionListProps> = ({
  items,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onReset,
  totalAmount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-zinc-900">Koreksi & Edit Data Transaksi</h3>
          <p className="text-xs text-zinc-500">Sesuaikan nama item, kuantitas, atau harga satuan bila ada ketidaksesuaian</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs text-zinc-600 hover:text-zinc-900"
            title="Kembalikan data ke hasil ekstraksi OCR awal"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Reset Awal</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onAddItem}
            className="text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Tambah Item</span>
          </Button>
        </div>
      </div>

      {/* Item List Table / Cards */}
      <div className="p-4 sm:p-5 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-zinc-300" />
            <p className="text-sm">Tidak ada item transaksi. Klik tombol di bawah untuk menambahkan item baru.</p>
            <Button variant="outline" size="sm" onClick={onAddItem} className="mt-2 text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Tambah Item Baru</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="p-3.5 bg-zinc-50/80 hover:bg-zinc-50 rounded-xl border border-zinc-200 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Item #{index + 1}
                  </span>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus baris ini"
                    aria-label={`Hapus ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                  {/* Item Name */}
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                      Nama Produk / Menu
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => onUpdateItem(item.id, { name: e.target.value })}
                      placeholder="Nama produk..."
                      className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-zinc-950"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                      Jumlah (Qty)
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => onUpdateItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                        className="w-7 h-7 bg-white border border-zinc-300 rounded-l-lg flex items-center justify-center text-xs font-bold text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200"
                        title="Kurangi kuantitas"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10)
                          onUpdateItem(item.id, { quantity: isNaN(val) || val < 1 ? 1 : val })
                        }}
                        className="w-full h-7 px-1 text-center bg-white border-y border-zinc-300 text-xs font-mono font-bold text-zinc-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => onUpdateItem(item.id, { quantity: item.quantity + 1 })}
                        className="w-7 h-7 bg-white border border-zinc-300 rounded-r-lg flex items-center justify-center text-xs font-bold text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200"
                        title="Tambah kuantitas"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                      Harga Satuan (Rp)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10)
                        onUpdateItem(item.id, { unitPrice: isNaN(val) || val < 0 ? 0 : val })
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-mono font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-zinc-950"
                    />
                  </div>

                  {/* Subtotal (Calculated) */}
                  <div className="sm:col-span-3 text-right sm:pb-1">
                    <span className="block text-[10px] text-zinc-400 uppercase font-semibold">
                      Subtotal
                    </span>
                    <span className="text-sm font-bold text-zinc-950 font-mono">
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Summary Footer */}
        <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            Total {items.length} item terdaftar
          </div>
          <div className="text-right">
            <span className="text-xs text-zinc-500 mr-2">Total Terkalkulasi:</span>
            <span className="text-lg font-extrabold text-zinc-950 font-mono">
              {formatRupiah(totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
