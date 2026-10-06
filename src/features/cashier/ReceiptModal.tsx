import React from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Transaction } from '../../types'
import { useThermalPrinter, PaperSize } from '../../hooks/useThermalPrinter'
import { formatRupiah, formatDate, cn } from '../../lib/utils'
import { Printer, Download, CheckCircle, Sparkles, Store } from 'lucide-react'

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
  storeName?: string
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
  storeName = 'KasirAI Coffee & Eatery',
}) => {
  const { paperSize, setPaperSize, isPrinting, printReceipt, generateEscPosText } =
    useThermalPrinter()

  if (!transaction) return null

  const handleDownloadTxt = () => {
    const text = generateEscPosText(transaction, storeName)
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${transaction.orderNumber}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Struk Pembayaran Berhasil"
      description="Transaksi telah dicatat dan stok inventori terpotong otomatis"
      size="receipt"
    >
      <div className="space-y-4">
        {/* Paper Size Toggle */}
        <div className="flex items-center justify-between p-2 bg-zinc-100 rounded-xl">
          <span className="text-xs font-semibold text-zinc-700">Format Kertas Kasir:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setPaperSize('58mm')}
              className={cn(
                'px-2.5 py-1 text-xs font-bold rounded-lg transition-all',
                paperSize === '58mm'
                  ? 'bg-zinc-900 text-white shadow-2xs'
                  : 'bg-white text-zinc-600 hover:text-zinc-900'
              )}
            >
              58 mm
            </button>
            <button
              onClick={() => setPaperSize('80mm')}
              className={cn(
                'px-2.5 py-1 text-xs font-bold rounded-lg transition-all',
                paperSize === '80mm'
                  ? 'bg-zinc-900 text-white shadow-2xs'
                  : 'bg-white text-zinc-600 hover:text-zinc-900'
              )}
            >
              80 mm
            </button>
          </div>
        </div>

        {/* Thermal Receipt Paper Rendering */}
        <div
          id="printable-receipt"
          className={cn(
            'mx-auto bg-white border border-zinc-200 p-5 rounded-lg shadow-inner font-mono text-[12px] leading-relaxed text-zinc-900 transition-all',
            paperSize === '58mm' ? 'max-w-[320px]' : 'max-w-[400px]'
          )}
        >
          {/* Header */}
          <div className="text-center pb-3 border-b border-dashed border-zinc-300">
            <h3 className="font-bold text-sm tracking-wide text-zinc-950 uppercase">{storeName}</h3>
            <p className="text-[11px] text-zinc-500">Jl. Teknologi No. 42, Jakarta</p>
            <p className="text-[11px] text-zinc-500">Telp: 0812-3456-7890</p>
          </div>

          {/* Meta Info */}
          <div className="py-2.5 border-b border-dashed border-zinc-300 space-y-0.5 text-[11px] text-zinc-600">
            <div className="flex justify-between">
              <span>No. Order:</span>
              <span className="font-bold text-zinc-900">{transaction.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>ID TRX:</span>
              <span>{transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Waktu:</span>
              <span>{formatDate(transaction.date)}</span>
            </div>
            <div className="flex justify-between">
              <span>Kasir:</span>
              <span>{transaction.cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span>Tipe Order:</span>
              <span className="uppercase font-semibold">
                {transaction.orderType === 'dine-in'
                  ? `Makan di Sini (Meja ${transaction.tableNumber || '-'})`
                  : 'Takeaway / Bungkus'}
              </span>
            </div>
            {transaction.customerName && (
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span>{transaction.customerName}</span>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="py-2.5 border-b border-dashed border-zinc-300 space-y-2">
            {transaction.items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="font-semibold text-zinc-900 text-xs">
                  {item.product.name}
                </div>
                {item.note && (
                  <div className="text-[10px] text-zinc-500 italic">
                    *{item.note}
                  </div>
                )}
                <div className="flex justify-between text-[11px] text-zinc-600">
                  <span>
                    {item.quantity} x {formatRupiah(item.product.price)}
                  </span>
                  <span className="font-medium text-zinc-900">
                    {formatRupiah(item.quantity * item.product.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Calculation */}
          <div className="py-2.5 border-b border-dashed border-zinc-300 space-y-1 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal:</span>
              <span>{formatRupiah(transaction.subtotal)}</span>
            </div>
            {transaction.discountAmount > 0 && (
              <div className="flex justify-between text-amber-700">
                <span>Diskon ({transaction.discountRate}%):</span>
                <span>-{formatRupiah(transaction.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-600">
              <span>PPN ({transaction.taxRate}%):</span>
              <span>{formatRupiah(transaction.taxAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-zinc-950 pt-1 border-t border-zinc-200">
              <span>TOTAL:</span>
              <span>{formatRupiah(transaction.total)}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="py-2.5 border-b border-dashed border-zinc-300 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Metode Bayar:</span>
              <span className="uppercase font-bold">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Jumlah Diterima:</span>
              <span>{formatRupiah(transaction.amountPaid)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Kembalian:</span>
              <span>{formatRupiah(transaction.changeAmount)}</span>
            </div>
          </div>

          {/* Footer & Barcode Simulation */}
          <div className="pt-3 text-center space-y-2 text-[11px] text-zinc-500">
            <p>Terima kasih atas kunjungan Anda!</p>
            {/* Barcode representation */}
            <div className="flex justify-center items-center gap-0.5 h-8 py-1">
              {[3, 1, 2, 4, 1, 3, 2, 1, 3, 4, 2, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1].map((w, i) => (
                <div
                  key={i}
                  className="bg-zinc-800 h-full"
                  style={{ width: `${w * 1.5}px` }}
                />
              ))}
            </div>
            <p className="text-[10px] text-zinc-400 font-sans">
              KasirAI Smart POS • POS System
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="primary"
              className="w-full font-bold"
              isLoading={isPrinting}
              onClick={printReceipt}
            >
              <Printer className="w-4 h-4 mr-2" />
              <span>Cetak Struk</span>
            </Button>

            <Button
              variant="outline"
              className="w-full text-xs font-semibold"
              onClick={handleDownloadTxt}
            >
              <Download className="w-4 h-4 mr-1.5" />
              <span>Unduh TXT</span>
            </Button>
          </div>

          <Button
            variant="secondary"
            className="w-full font-semibold text-zinc-900"
            onClick={onClose}
          >
            <span>Transaksi Baru Selesai</span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}
