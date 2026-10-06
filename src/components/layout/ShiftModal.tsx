import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useTransactionStore } from '../../store/useTransactionStore'
import { useUserStore } from '../../store/useUserStore'
import { formatRupiah, formatDate } from '../../lib/utils'
import { Clock, DollarSign, CreditCard, QrCode, CheckCircle2, AlertCircle } from 'lucide-react'

interface ShiftModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ShiftModal: React.FC<ShiftModalProps> = ({ isOpen, onClose }) => {
  const { activeShift, startShift, closeShift } = useTransactionStore()
  const { user } = useUserStore()
  const [newStartingCash, setNewStartingCash] = useState('500000')
  const [isStartingNew, setIsStartingNew] = useState(false)

  const isShiftOpen = activeShift.status === 'open'
  const expectedCashInDrawer = activeShift.startingCash + activeShift.cashSales

  const handleCloseShift = () => {
    if (window.confirm('Apakah Anda yakin ingin menutup shift kasir saat ini?')) {
      closeShift()
    }
  }

  const handleStartNewShift = () => {
    const cash = parseInt(newStartingCash.replace(/\D/g, ''), 10) || 0
    startShift(cash, user?.name || 'Kasir')
    setIsStartingNew(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isShiftOpen ? 'Informasi Shift Kasir' : 'Buka Shift Baru'}
      description={
        isShiftOpen
          ? `Shift aktif sejak ${formatDate(activeShift.startTime)}`
          : 'Mulai sesi kasir baru dengan modal kas awal'
      }
      size="md"
    >
      {isShiftOpen && !isStartingNew ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Shift #{activeShift.id.slice(-6)} Sedang Berjalan</span>
            </div>
            <span className="font-bold">{activeShift.cashierName}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <span className="text-zinc-500 block mb-1">Modal Kas Awal</span>
              <span className="font-bold text-sm text-zinc-900">
                {formatRupiah(activeShift.startingCash)}
              </span>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <span className="text-zinc-500 block mb-1">Total Omzet Shift</span>
              <span className="font-bold text-sm text-emerald-600">
                {formatRupiah(activeShift.totalSales)}
              </span>
            </div>
          </div>

          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2.5 text-xs">
            <h4 className="font-bold text-zinc-900 border-b border-zinc-200 pb-2">
              Rincian Metode Pembayaran
            </h4>
            <div className="flex justify-between items-center text-zinc-600">
              <div className="flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                <span>Penjualan Tunai:</span>
              </div>
              <span className="font-semibold text-zinc-900">
                {formatRupiah(activeShift.cashSales)}
              </span>
            </div>
            <div className="flex justify-between items-center text-zinc-600">
              <div className="flex items-center gap-2">
                <QrCode className="w-3.5 h-3.5 text-zinc-400" />
                <span>Penjualan QRIS:</span>
              </div>
              <span className="font-semibold text-zinc-900">
                {formatRupiah(activeShift.qrisSales)}
              </span>
            </div>
            <div className="flex justify-between items-center text-zinc-600">
              <div className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                <span>Penjualan Kartu/Debit:</span>
              </div>
              <span className="font-semibold text-zinc-900">
                {formatRupiah(activeShift.cardSales)}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 text-white space-y-1">
            <span className="text-[11px] text-zinc-400 uppercase font-semibold tracking-wider">
              Ekspektasi Uang Fisik di Laci Kas:
            </span>
            <div className="text-xl font-extrabold text-amber-400">
              {formatRupiah(expectedCashInDrawer)}
            </div>
            <p className="text-[11px] text-zinc-400">
              (Modal Awal {formatRupiah(activeShift.startingCash)} + Kas Masuk {formatRupiah(activeShift.cashSales)})
            </p>
          </div>

          <div className="pt-2 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Tutup
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleCloseShift}>
              Tutup Shift Kasir
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Shift sebelumnya telah ditutup. Masukkan modal uang awal untuk membuka kasir.</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700">
              Modal Awal Uang Kas (Rp)
            </label>
            <Input
              type="number"
              value={newStartingCash}
              onChange={(e) => setNewStartingCash(e.target.value)}
              placeholder="500000"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleStartNewShift}>
              Buka Shift Sekarang
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
