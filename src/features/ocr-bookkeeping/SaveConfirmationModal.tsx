import React, { useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { OCRExtractedItem } from './types'
import { formatRupiah } from '../../lib/utils'
import { PaymentMethod } from '../../types'
import {
  CheckCircle2,
  DollarSign,
  QrCode,
  CreditCard,
  Receipt,
  FileCheck2,
} from 'lucide-react'

interface SaveConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  items: OCRExtractedItem[]
  totalAmount: number
  onConfirm: (paymentMethod: PaymentMethod, notes: string) => void
  isLoading?: boolean
}

export const SaveConfirmationModal: React.FC<SaveConfirmationModalProps> = ({
  isOpen,
  onClose,
  items,
  totalAmount,
  onConfirm,
  isLoading = false,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [notes, setNotes] = useState<string>('Catatan Pembukuan Manual via OCR')

  const handleConfirm = () => {
    onConfirm(paymentMethod, notes)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Penyimpanan Catatan Pembukuan"
      size="md"
    >
      <div className="space-y-4 pt-1 text-xs">
        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-zinc-600 font-semibold">
            <span>Jumlah Item:</span>
            <span className="font-mono text-zinc-900">{items.length} Item</span>
          </div>
          <div className="flex items-center justify-between text-zinc-600 font-semibold">
            <span>Total Transaksi Terkalkulasi:</span>
            <span className="font-mono text-base font-extrabold text-zinc-950">
              {formatRupiah(totalAmount)}
            </span>
          </div>
        </div>

        {/* Item Preview list */}
        <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 border-y border-zinc-100 py-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-zinc-700">
              <span className="truncate max-w-[220px]">
                <strong>{item.quantity}x</strong> {item.name}
              </span>
              <span className="font-mono text-zinc-900">{formatRupiah(item.subtotal)}</span>
            </div>
          ))}
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-1.5">
          <label className="block font-bold text-zinc-800">
            Metode Pembayaran (Tercatat di Catatan)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                paymentMethod === 'cash'
                  ? 'border-zinc-950 bg-zinc-950 text-white font-bold shadow-xs'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Tunai (Cash)</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('qris')}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                paymentMethod === 'qris'
                  ? 'border-zinc-950 bg-zinc-950 text-white font-bold shadow-xs'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>QRIS</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                paymentMethod === 'card'
                  ? 'border-zinc-950 bg-zinc-950 text-white font-bold shadow-xs'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Kartu / EDC</span>
            </button>
          </div>
        </div>

        {/* Notes input */}
        <div className="space-y-1">
          <label className="block font-bold text-zinc-800">Catatan Tambahan</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Pembukuan penjualan shift pagi meja 07"
            className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-zinc-200">
          <Button
            type="button"
            variant="outline"
            className="w-1/3"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>

          <Button
            type="button"
            variant="primary"
            className="w-2/3 font-bold"
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            <FileCheck2 className="w-4 h-4 mr-1.5" />
            <span>Simpan Transaksi ({formatRupiah(totalAmount)})</span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}
