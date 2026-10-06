import React, { useState, useEffect } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PaymentMethod, Transaction } from '../../types'
import { useCartStore } from '../../store/useCartStore'
import { useTransactionStore } from '../../store/useTransactionStore'
import { useUserStore } from '../../store/useUserStore'
import { formatRupiah, cn } from '../../lib/utils'
import {
  Banknote,
  QrCode,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (transaction: Transaction) => void
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    cartItems,
    orderType,
    tableNumber,
    customerName,
    discountRate,
    taxRate,
    getSubtotal,
    getDiscountAmount,
    getTaxAmount,
    getTotal,
    clearCart,
  } = useCartStore()

  const { createTransaction } = useTransactionStore()
  const { user } = useUserStore()

  const total = getTotal()
  const subtotal = getSubtotal()
  const calcDiscount = getDiscountAmount()
  const calcTax = getTaxAmount()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [cashGiven, setCashGiven] = useState<number>(total)
  const [cashInputString, setCashInputString] = useState<string>(total.toString())
  const [cardBank, setCardBank] = useState<string>('BCA')
  const [cardApprovalCode, setCardApprovalCode] = useState<string>('98214')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  // Reset cash input whenever total changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCashGiven(total)
      setCashInputString(total.toString())
    }
  }, [isOpen, total])

  // Calculate change
  const changeAmount = Math.max(0, cashGiven - total)
  const isCashInsufficient = paymentMethod === 'cash' && cashGiven < total

  const handleCashInputChange = (val: string) => {
    const rawNumber = parseInt(val.replace(/\D/g, ''), 10) || 0
    setCashGiven(rawNumber)
    setCashInputString(rawNumber.toString())
  }

  const handleQuickCash = (amount: number) => {
    setCashGiven(amount)
    setCashInputString(amount.toString())
  }

  const handleCompletePayment = async () => {
    if (isCashInsufficient) return
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 600))

    const finalAmountPaid = paymentMethod === 'cash' ? cashGiven : total
    const finalChange = paymentMethod === 'cash' ? changeAmount : 0

    const newTrx = createTransaction({
      items: [...cartItems],
      subtotal,
      discountRate,
      discountAmount: calcDiscount,
      taxRate,
      taxAmount: calcTax,
      total,
      paymentMethod,
      amountPaid: finalAmountPaid,
      changeAmount: finalChange,
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      customerName: customerName || undefined,
      cashierName: user?.name || 'Kasir KasirAI',
    })

    setIsProcessing(false)
    clearCart()
    onSuccess(newTrx)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pembayaran Transaksi"
      description={`Total Tagihan: ${formatRupiah(total)}`}
      size="lg"
    >
      <div className="space-y-5">
        {/* Payment Method Selector */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setPaymentMethod('cash')
              setCashGiven(total)
              setCashInputString(total.toString())
            }}
            className={cn(
              'p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer',
              paymentMethod === 'cash'
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
            )}
          >
            <Banknote className="w-5 h-5" />
            <span className="text-xs font-bold">Tunai (Cash)</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('qris')}
            className={cn(
              'p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer',
              paymentMethod === 'qris'
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
            )}
          >
            <QrCode className="w-5 h-5" />
            <span className="text-xs font-bold">QRIS Instant</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={cn(
              'p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer',
              paymentMethod === 'card'
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
            )}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-xs font-bold">Kartu / Debit</span>
          </button>
        </div>

        {/* Tab 1: CASH PAYMENT */}
        {paymentMethod === 'cash' && (
          <div className="space-y-4 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Uang Diterima dari Pelanggan (Rp)
              </label>
              <Input
                type="text"
                value={cashInputString}
                onChange={(e) => handleCashInputChange(e.target.value)}
                className="text-lg font-bold font-mono h-11"
                placeholder="0"
                autoFocus
              />
            </div>

            {/* Quick cash denomination buttons */}
            <div>
              <span className="text-[11px] font-medium text-zinc-400 block mb-1.5">
                Pilihan Cepat Nominal:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickCash(total)}
                  className="py-1.5 px-2 text-xs font-bold bg-white border border-zinc-200 rounded-lg hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  Uang Pas
                </button>
                {[50000, 100000, 200000].map((nominal) => (
                  <button
                    key={nominal}
                    type="button"
                    onClick={() => handleQuickCash(nominal)}
                    className="py-1.5 px-2 text-xs font-bold bg-white border border-zinc-200 rounded-lg hover:bg-zinc-900 hover:text-white transition-colors"
                  >
                    {formatRupiah(nominal)}
                  </button>
                ))}
              </div>
            </div>

            {/* Change indicator box */}
            <div
              className={cn(
                'p-3.5 rounded-xl border flex items-center justify-between',
                isCashInsufficient
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              )}
            >
              <div>
                <span className="text-xs font-medium block">
                  {isCashInsufficient ? 'Uang Pembayaran Kurang' : 'Kembalian Pelanggan'}
                </span>
                <span className="text-xl font-extrabold font-mono">
                  {isCashInsufficient
                    ? formatRupiah(total - cashGiven)
                    : formatRupiah(changeAmount)}
                </span>
              </div>
              {isCashInsufficient ? (
                <AlertCircle className="w-6 h-6 text-rose-600" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              )}
            </div>
          </div>
        )}

        {/* Tab 2: QRIS PAYMENT */}
        {paymentMethod === 'qris' && (
          <div className="flex flex-col items-center p-5 bg-zinc-50 rounded-xl border border-zinc-200 text-center space-y-3">
            <div className="bg-white p-3 rounded-2xl border border-zinc-200 shadow-xs">
              {/* High quality clean SVG mock QRIS */}
              <svg
                className="w-44 h-44 text-zinc-900"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                {/* QR Code pattern visual simulation */}
                <rect width="100" height="100" fill="white" />
                {/* Top-left marker */}
                <rect x="10" y="10" width="25" height="25" fill="#18181B" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" fill="#18181B" />
                {/* Top-right marker */}
                <rect x="65" y="10" width="25" height="25" fill="#18181B" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" fill="#18181B" />
                {/* Bottom-left marker */}
                <rect x="10" y="65" width="25" height="25" fill="#18181B" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" fill="#18181B" />
                {/* Mock data pixels */}
                <rect x="40" y="12" width="6" height="6" fill="#18181B" />
                <rect x="50" y="18" width="6" height="6" fill="#18181B" />
                <rect x="42" y="28" width="8" height="6" fill="#18181B" />
                <rect x="40" y="40" width="20" height="20" fill="#18181B" />
                <rect x="45" y="45" width="10" height="10" fill="white" />
                <rect x="48" y="48" width="4" height="4" fill="#18181B" />
                <rect x="12" y="42" width="6" height="8" fill="#18181B" />
                <rect x="22" y="48" width="8" height="6" fill="#18181B" />
                <rect x="68" y="42" width="8" height="6" fill="#18181B" />
                <rect x="80" y="48" width="8" height="8" fill="#18181B" />
                <rect x="42" y="68" width="8" height="8" fill="#18181B" />
                <rect x="54" y="65" width="6" height="6" fill="#18181B" />
                <rect x="65" y="72" width="12" height="6" fill="#18181B" />
                <rect x="80" y="80" width="10" height="10" fill="#18181B" />
                <rect x="44" y="82" width="6" height="8" fill="#18181B" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">QRIS Dinamis Otomatis</p>
              <p className="text-[11px] text-zinc-500">
                Pindai menggunakan GoPay, OVO, Dana, BCA Mobile, atau ShopeePay
              </p>
            </div>
            <div className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Menunggu konfirmasi pembayaran...</span>
            </div>
          </div>
        )}

        {/* Tab 3: CARD PAYMENT */}
        {paymentMethod === 'card' && (
          <div className="space-y-3.5 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Mesin EDC / Bank Penerbit
              </label>
              <select
                value={cardBank}
                onChange={(e) => setCardBank(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-white border border-zinc-300 rounded-lg text-zinc-900"
              >
                <option value="BCA">BCA (Debit / Flazz / Credit)</option>
                <option value="Mandiri">Mandiri (Livin / Debit)</option>
                <option value="BRI">BRI (Debit / Brizzi)</option>
                <option value="BNI">BNI (TapCash / Debit)</option>
                <option value="Visa">Visa / Mastercard Internasional</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Nomor Referensi / Approval Code EDC
              </label>
              <Input
                type="text"
                value={cardApprovalCode}
                onChange={(e) => setCardApprovalCode(e.target.value)}
                placeholder="Contoh: 893122"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2 border-t border-zinc-100">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            className="flex-2 font-bold"
            disabled={isCashInsufficient}
            isLoading={isProcessing}
            onClick={handleCompletePayment}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            <span>Selesaikan & Terbitkan Struk</span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}
