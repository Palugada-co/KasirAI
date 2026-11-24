import React, { useState } from 'react'
import { OCRExtractedItem, OCRScanStep } from './types'
import { DEFAULT_EXTRACTED_ITEMS, SAMPLE_LEDGER_IMAGE, BOOKKEEPING_PRESETS } from './mockData'
import { ReceiptStructuredView } from './ReceiptStructuredView'
import { EditableTransactionList } from './EditableTransactionList'
import { CameraViewfinder } from './CameraViewfinder'
import { OCRProcessingAnimation } from './OCRProcessingAnimation'
import { SaveConfirmationModal } from './SaveConfirmationModal'
import { Button } from '../../components/ui/Button'
import { formatRupiah } from '../../lib/utils'
import { useToast } from '../../components/shared/Toast'
import { useTransactionStore } from '../../store/useTransactionStore'
import { useInventoryStore } from '../../store/useInventoryStore'
import { useUserStore } from '../../store/useUserStore'
import { PaymentMethod, Product } from '../../types'
import { useNavigate } from 'react-router-dom'
import {
  Upload,
  Camera,
  Sparkles,
  Receipt,
  CheckCircle2,
  RefreshCw,
  Edit3,
  Store,
  FileCheck2,
  Image as ImageIcon,
} from 'lucide-react'

export const OCRBookkeepingFeature: React.FC = () => {
  const { showToast } = useToast()
  const { createTransaction } = useTransactionStore()
  const { products } = useInventoryStore()
  const { user } = useUserStore()
  const navigate = useNavigate()

  // State
  const [step, setStep] = useState<OCRScanStep>('idle')
  const [inputMode, setInputMode] = useState<'upload' | 'camera'>('upload')
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_LEDGER_IMAGE)
  const [items, setItems] = useState<OCRExtractedItem[]>(DEFAULT_EXTRACTED_ITEMS)
  const [viewMode, setViewMode] = useState<'receipt' | 'edit'>('receipt')
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [savedTransactionNumber, setSavedTransactionNumber] = useState<string | null>(null)

  // Calculate Total dynamically
  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0)

  // Handlers for Items
  const handleUpdateItem = (id: string, updates: Partial<OCRExtractedItem>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates }
          // Recalculate subtotal
          updated.subtotal = updated.quantity * updated.unitPrice
          return updated
        }
        return item
      })
    )
  }

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    showToast('Item Dihapus', 'Baris item berhasil dihapus dari daftar.', 'info')
  }

  const handleAddItem = () => {
    const newItem: OCRExtractedItem = {
      id: `ocr-item-${Date.now()}`,
      name: 'Item Tambahan',
      quantity: 1,
      unitPrice: 15000,
      subtotal: 15000,
      confidence: 1.0,
    }
    setItems((prev) => [...prev, newItem])
    setViewMode('edit')
    showToast('Item Ditambahkan', 'Baris item baru berhasil ditambahkan.', 'success')
  }

  const handleReset = () => {
    setItems(DEFAULT_EXTRACTED_ITEMS)
    showToast('Data Direset', 'Daftar item dikembalikan ke hasil OCR awal.', 'info')
  }

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result)
          setStep('processing')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Camera Capture
  const handleCameraCapture = (imageDataUrl: string) => {
    if (imageDataUrl === 'simulated-capture') {
      setSelectedImage(SAMPLE_LEDGER_IMAGE)
    } else {
      setSelectedImage(imageDataUrl)
    }
    setStep('processing')
  }

  // Preset Selection
  const handleSelectPreset = (presetId: string) => {
    const preset = BOOKKEEPING_PRESETS.find((p) => p.id === presetId)
    if (preset) {
      setSelectedImage(preset.image)
      setItems(preset.items)
      setStep('processing')
    }
  }

  // Confirm and Save
  const handleConfirmSave = async (paymentMethod: PaymentMethod, notes: string) => {
    if (items.length === 0) {
      showToast('Gagal Menyimpan', 'Tidak ada item transaksi untuk disimpan.', 'error')
      return
    }

    setIsSaving(true)
    try {
      // Build transaction items, attempting to match with catalog products
      const trxItems = items.map((item) => {
        // Find existing product by ID or name
        const matched = products.find(
          (p) =>
            p.id === item.matchedProductId ||
            p.name.toLowerCase() === item.name.toLowerCase()
        )

        const product: Product = matched || {
          id: `custom-prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: item.name,
          sku: 'OCR-MANUAL',
          barcode: `899${Math.floor(1000000 + Math.random() * 9000000)}`,
          categoryId: 'beverage',
          categoryName: 'Catatan OCR',
          buyPrice: Math.round(item.unitPrice * 0.6),
          price: item.unitPrice,
          stock: 99,
          minStock: 5,
          unit: 'pcs',
          image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60',
          isActive: true,
        }

        return {
          product,
          quantity: item.quantity,
        }
      })

      // Create transaction in store
      const newTrx = createTransaction({
        items: trxItems,
        subtotal: totalAmount,
        discountRate: 0,
        discountAmount: 0,
        taxRate: 0,
        taxAmount: 0,
        total: totalAmount,
        paymentMethod,
        amountPaid: totalAmount,
        changeAmount: 0,
        orderType: 'takeaway',
        customerName: notes || 'Pembukuan OCR',
        cashierName: user?.name || 'Kasir PaluPay',
      })

      setSavedTransactionNumber(newTrx.orderNumber)
      setIsConfirmationOpen(false)
      setStep('saved')
      showToast(
        'Catatan Pembukuan Berhasil Disimpan',
        `Transaksi ${newTrx.orderNumber} senilai ${formatRupiah(totalAmount)} telah dicatat ke laporan POS.`,
        'success'
      )
    } catch {
      showToast('Gagal Menyimpan', 'Terjadi kesalahan saat menyimpan transaksi.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Idle / Upload or Camera Scan */}
      {step === 'idle' && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 rounded-2xl border border-zinc-800 shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fitur Prototipe OCR Cerdas</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Pindai & Ekstraksi Catatan Pembukuan Tulisan Tangan
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Unggah atau foto catatan penjualan harian, buku kas, atau nota tulisan tangan Anda. Sistem akan mengekstrak nama menu, kuantitas, dan harga secara otomatis ke dalam format struk transaksi siap simpan.
                </p>
              </div>

              {/* Quick Sample Button */}
              <div className="shrink-0 w-full md:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    setSelectedImage(SAMPLE_LEDGER_IMAGE)
                    setItems(DEFAULT_EXTRACTED_ITEMS)
                    setStep('processing')
                  }}
                  className="w-full md:w-auto font-bold bg-white text-zinc-950 hover:bg-zinc-100 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                  <span>Uji Coba Cepat (Sampel Rekomendasi)</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Input Method Selector (Upload vs Camera) */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
            <div className="border-b border-zinc-200 px-6 pt-4 flex gap-6">
              <button
                type="button"
                onClick={() => setInputMode('upload')}
                className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  inputMode === 'upload'
                    ? 'border-zinc-950 text-zinc-950'
                    : 'border-transparent text-zinc-400 hover:text-zinc-700'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload Foto Catatan</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode('camera')}
                className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  inputMode === 'camera'
                    ? 'border-zinc-950 text-zinc-950'
                    : 'border-transparent text-zinc-400 hover:text-zinc-700'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Ambil Foto Kamera</span>
              </button>
            </div>

            <div className="p-6">
              {inputMode === 'upload' ? (
                <div className="space-y-6">
                  {/* Drag and Drop Upload Area */}
                  <label className="border-2 border-dashed border-zinc-300 hover:border-zinc-950 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-zinc-50/50 hover:bg-zinc-50 group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 shadow-2xs flex items-center justify-center text-zinc-700 group-hover:scale-105 transition-transform mb-3">
                      <Upload className="w-6 h-6 text-zinc-800" />
                    </div>
                    <span className="font-bold text-sm text-zinc-900 mb-1">
                      Klik untuk memilih file atau seret foto catatan ke sini
                    </span>
                    <span className="text-xs text-zinc-400">
                      Mendukung format JPG, PNG, WEBP (Catatan tulisan tangan atau nota belanja)
                    </span>
                  </label>

                  {/* Preset Options */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                      Atau pilih contoh catatan pembukuan siap uji:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {BOOKKEEPING_PRESETS.map((preset) => (
                        <div
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset.id)}
                          className="p-4 rounded-xl border border-zinc-200 hover:border-zinc-950 bg-white hover:bg-zinc-50 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                        >
                          <div className="space-y-1">
                            <h4 className="font-bold text-xs sm:text-sm text-zinc-900 group-hover:text-zinc-950">
                              {preset.title}
                            </h4>
                            <p className="text-[11px] text-zinc-500">
                              {preset.subtitle}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="text-xs shrink-0 font-semibold">
                            Pindai
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <CameraViewfinder
                    onCapture={handleCameraCapture}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Processing Animation */}
      {step === 'processing' && (
        <OCRProcessingAnimation
          imageSrc={selectedImage}
          onComplete={() => setStep('reviewed')}
        />
      )}

      {/* Step 3: Reviewed (Receipt View & Edit Mode) */}
      {step === 'reviewed' && (
        <div className="space-y-6 animate-scale-up">
          {/* Top Action Bar */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-zinc-900">
                  Hasil Pemindaian OCR Berhasil
                </h3>
                <p className="text-xs text-zinc-500">
                  {items.length} item terdeteksi • Total terhitung: <strong className="font-mono text-zinc-900">{formatRupiah(totalAmount)}</strong>
                </p>
              </div>
            </div>

            {/* View Mode Switcher and Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="bg-zinc-100 p-1 rounded-xl flex items-center">
                <button
                  type="button"
                  onClick={() => setViewMode('receipt')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'receipt'
                      ? 'bg-white text-zinc-950 shadow-2xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Format Struk</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('edit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'edit'
                      ? 'bg-white text-zinc-950 shadow-2xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Koreksi Data</span>
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep('idle')}
                className="text-xs font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                <span>Pindai Ulang</span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsConfirmationOpen(true)}
                className="text-xs font-bold bg-zinc-950 text-white"
              >
                <FileCheck2 className="w-3.5 h-3.5 mr-1.5" />
                <span>Simpan Transaksi</span>
              </Button>
            </div>
          </div>

          {/* Main Content Area: Side-by-side or Tabbed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Document image preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-600 font-bold border-b border-zinc-100 pb-2">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-zinc-500" />
                    <span>Foto Catatan Sumber OCR</span>
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">100% Loaded</span>
                </div>

                <div className="rounded-xl overflow-hidden border border-zinc-200 bg-zinc-900/5 aspect-4/3 flex items-center justify-center p-2">
                  <img
                    src={selectedImage}
                    alt="Source Bookkeeping Record"
                    className="w-full h-full object-contain rounded-lg shadow-2xs"
                  />
                </div>

                <div className="text-[11px] text-zinc-500 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 leading-relaxed">
                  💡 <em>Data item, jumlah (qty), dan harga satuan diekstrak langsung dari foto tulisan tangan ini. Anda dapat mengedit item jika terdapat salah baca.</em>
                </div>
              </div>
            </div>

            {/* Right: Receipt Structured View OR Editable Table */}
            <div className="lg:col-span-7 space-y-4">
              {viewMode === 'receipt' ? (
                <div className="space-y-4">
                  <ReceiptStructuredView
                    items={items}
                    totalAmount={totalAmount}
                    receiptNote="Dicatat dari buku catatan kasir harian"
                  />

                  {/* Prompt to Edit if needed */}
                  <div className="flex items-center justify-between p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900">
                    <span>Perlu mengubah nama menu, jumlah, atau harga satuan?</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewMode('edit')}
                      className="bg-white text-xs font-semibold text-zinc-900 border-amber-300 hover:bg-amber-100"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1" />
                      <span>Edit Item</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <EditableTransactionList
                  items={items}
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                  onAddItem={handleAddItem}
                  onReset={handleReset}
                  totalAmount={totalAmount}
                />
              )}

              {/* Bottom Sticky-like Action Footer */}
              <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <span className="text-xs text-zinc-500">Total Transaksi ({items.length} item):</span>
                  <div className="text-xl font-extrabold text-zinc-950 font-mono">
                    {formatRupiah(totalAmount)}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none text-xs"
                    onClick={handleAddItem}
                  >
                    + Tambah Item
                  </Button>

                  <Button
                    variant="primary"
                    className="flex-1 sm:flex-none text-xs font-bold px-6 bg-zinc-950 text-white"
                    onClick={() => setIsConfirmationOpen(true)}
                  >
                    <FileCheck2 className="w-4 h-4 mr-1.5" />
                    <span>Konfirmasi & Simpan</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Saved Success State */}
      {step === 'saved' && (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6 sm:p-10 text-center max-w-xl mx-auto space-y-6 animate-scale-up">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950">
              Catatan Pembukuan Berhasil Disimpan!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              Transaksi <strong className="text-zinc-900 font-mono font-bold">{savedTransactionNumber}</strong> senilai <strong className="text-zinc-900 font-mono font-bold">{formatRupiah(totalAmount)}</strong> telah berhasil dicatat ke sistem POS.
            </p>
          </div>

          {/* Quick summary receipt snippet */}
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-left text-xs space-y-2">
            <div className="flex justify-between font-bold text-zinc-700 pb-1.5 border-b border-zinc-200">
              <span>Item Transaksi Terdaftar</span>
              <span>{items.length} Menu</span>
            </div>
            {items.map((it) => (
              <div key={it.id} className="flex justify-between text-zinc-600">
                <span>{it.quantity}x {it.name}</span>
                <span className="font-mono text-zinc-900">{formatRupiah(it.subtotal)}</span>
              </div>
            ))}
            <div className="flex justify-between font-extrabold text-sm text-zinc-950 pt-2 border-t border-zinc-200">
              <span>Total:</span>
              <span className="font-mono">{formatRupiah(totalAmount)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setStep('idle')
                setSelectedImage(SAMPLE_LEDGER_IMAGE)
                setItems(DEFAULT_EXTRACTED_ITEMS)
                setViewMode('receipt')
              }}
              className="w-full sm:w-auto text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              <span>Scan Catatan Baru</span>
            </Button>

            <Button
              variant="primary"
              onClick={() => navigate('/cashier')}
              className="w-full sm:w-auto text-xs font-bold"
            >
              <Store className="w-4 h-4 mr-1.5" />
              <span>Kembali ke Kasir POS</span>
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <SaveConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        items={items}
        totalAmount={totalAmount}
        onConfirm={handleConfirmSave}
        isLoading={isSaving}
      />
    </div>
  )
}
