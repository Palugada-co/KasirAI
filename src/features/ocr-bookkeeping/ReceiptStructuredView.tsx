import React from 'react'
import { OCRExtractedItem } from './types'
import { formatRupiah } from '../../lib/utils'
import { CheckCircle2, Receipt, Sparkles } from 'lucide-react'

interface ReceiptStructuredViewProps {
  items: OCRExtractedItem[]
  totalAmount: number
  storeName?: string
  dateString?: string
  receiptNote?: string
}

export const ReceiptStructuredView: React.FC<ReceiptStructuredViewProps> = ({
  items,
  totalAmount,
  storeName = 'PaluPay Coffee & Eatery',
  dateString,
  receiptNote,
}) => {
  const currentDate = dateString || new Date().toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs overflow-hidden font-sans">
      {/* Receipt Top Header */}
      <div className="bg-zinc-950 text-white px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-amber-300">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-100 leading-tight">
              {storeName}
            </h3>
            <p className="text-[11px] text-zinc-400">Hasil Ekstraksi OCR Catatan Pembukuan</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>OCR Terverifikasi</span>
        </div>
      </div>

      {/* Receipt Paper Body */}
      <div className="p-5 sm:p-6 space-y-4 bg-gradient-to-b from-white to-zinc-50/50">
        <div className="flex items-center justify-between text-xs text-zinc-500 pb-3 border-b border-dashed border-zinc-200">
          <span>Waktu Pindai: <strong className="text-zinc-700 font-semibold">{currentDate}</strong></span>
          <span className="font-mono text-[11px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
            {items.length} Item
          </span>
        </div>

        {/* Expected UI: Structured Receipt Format */}
        <div className="space-y-3.5 divide-y divide-zinc-100">
          {items.map((item) => (
            <div key={item.id} className="pt-3 first:pt-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-zinc-900 leading-snug truncate">
                    {item.name}
                  </h4>
                  <div className="text-xs text-zinc-500 mt-0.5 font-mono">
                    {item.quantity} × {formatRupiah(item.unitPrice)}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-sm text-zinc-900 font-mono">
                    {formatRupiah(item.subtotal)}
                  </span>
                  {item.confidence && (
                    <div className="text-[10px] text-emerald-600 flex items-center justify-end gap-0.5 mt-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{Math.round(item.confidence * 100)}% cocok</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dashed Separator */}
        <div className="border-t-2 border-dashed border-zinc-200 pt-3.5 mt-4 space-y-2">
          {/* Subtotal summary */}
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Subtotal Transaksi</span>
            <span className="font-mono font-medium text-zinc-700">{formatRupiah(totalAmount)}</span>
          </div>

          {/* Grand Total */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Total Transaksi
              </span>
              <p className="text-[10px] text-zinc-400">Otomatis dihitung dari {items.length} item</p>
            </div>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-extrabold text-zinc-950 font-mono tracking-tight">
                {formatRupiah(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {receiptNote && (
          <div className="text-[11px] text-zinc-500 bg-zinc-100/80 p-2.5 rounded-xl border border-zinc-200">
            <span className="font-semibold text-zinc-700">Catatan Tulisan Tangan: </span>
            {receiptNote}
          </div>
        )}
      </div>
    </div>
  )
}
