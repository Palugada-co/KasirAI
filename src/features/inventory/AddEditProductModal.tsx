import React, { useEffect, useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Product } from '../../types'
import { useInventoryStore } from '../../store/useInventoryStore'
import { useToast } from '../../components/shared/Toast'
import { Image as ImageIcon, Sparkles, Upload } from 'lucide-react'

interface AddEditProductModalProps {
  isOpen: boolean
  onClose: () => void
  productToEdit?: Product | null
}

const SAMPLE_IMAGES = [
  { label: 'Kopi', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60' },
  { label: 'Croissant', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60' },
  { label: 'Nasi Goreng', url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=60' },
  { label: 'Kentang', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60' },
  { label: 'Matcha', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60' },
  { label: 'Tumbler', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60' },
]

export const AddEditProductModal: React.FC<AddEditProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { categories, addProduct, updateProduct } = useInventoryStore()
  const { showToast } = useToast()

  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [barcode, setBarcode] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [buyPrice, setBuyPrice] = useState('10000')
  const [price, setPrice] = useState('20000')
  const [stock, setStock] = useState('20')
  const [minStock, setMinStock] = useState('5')
  const [unit, setUnit] = useState('pcs')
  const [image, setImage] = useState(SAMPLE_IMAGES[0].url)
  const [description, setDescription] = useState('')

  const isEditing = !!productToEdit

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setName(productToEdit.name)
        setSku(productToEdit.sku)
        setBarcode(productToEdit.barcode)
        setCategoryId(productToEdit.categoryId)
        setBuyPrice(productToEdit.buyPrice.toString())
        setPrice(productToEdit.price.toString())
        setStock(productToEdit.stock.toString())
        setMinStock(productToEdit.minStock.toString())
        setUnit(productToEdit.unit)
        setImage(productToEdit.image)
        setDescription(productToEdit.description || '')
      } else {
        const generatedSku = 'SKU-' + Math.floor(100 + Math.random() * 900)
        setName('')
        setSku(generatedSku)
        setBarcode('899' + Math.floor(1000000 + Math.random() * 9000000))
        setCategoryId(categories.filter((c) => c.id !== 'all')[0]?.id || 'beverage')
        setBuyPrice('10000')
        setPrice('22000')
        setStock('25')
        setMinStock('5')
        setUnit('pcs')
        setImage(SAMPLE_IMAGES[0].url)
        setDescription('')
      }
    }
  }, [isOpen, productToEdit, categories])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      showToast('Form tidak lengkap', 'Nama produk wajib diisi', 'error')
      return
    }

    const selectedCategory = categories.find((c) => c.id === categoryId)
    const categoryName = selectedCategory ? selectedCategory.name : 'Umum'

    const payload = {
      name: name.trim(),
      sku: sku.trim(),
      barcode: barcode.trim(),
      categoryId,
      categoryName,
      buyPrice: parseInt(buyPrice, 10) || 0,
      price: parseInt(price, 10) || 0,
      stock: parseInt(stock, 10) || 0,
      minStock: parseInt(minStock, 10) || 0,
      unit,
      image,
      description: description.trim(),
      isActive: true,
    }

    if (isEditing && productToEdit) {
      updateProduct(productToEdit.id, payload)
      showToast('Produk Diperbarui', `${payload.name} berhasil disimpan`, 'success')
    } else {
      addProduct(payload)
      showToast('Produk Ditambahkan', `${payload.name} telah masuk ke inventori`, 'success')
    }

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Ubah Data Produk' : 'Tambah Produk Baru'}
      description="Kelola informasi katalog, harga modal & jual, serta stok awal"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Column: Image Upload & Preview */}
          <div className="md:col-span-1 space-y-2.5">
            <label className="block text-xs font-semibold text-zinc-700">
              Foto Produk
            </label>
            <div className="aspect-square rounded-xl border border-zinc-200 overflow-hidden bg-zinc-100 relative group">
              <img
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-[11px] font-medium">Unggah Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image URL text */}
            <Input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="text-[11px] h-8"
            />

            {/* Quick preset thumbnail chips */}
            <div>
              <span className="text-[10px] text-zinc-400 font-medium block mb-1">
                Preset Foto:
              </span>
              <div className="flex flex-wrap gap-1">
                {SAMPLE_IMAGES.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImage(sample.url)}
                    className="text-[10px] px-2 py-0.5 bg-zinc-100 hover:bg-zinc-200 rounded border border-zinc-200"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="md:col-span-2 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Nama Produk *
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Kopi Susu Aren"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  SKU Produk
                </label>
                <Input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="BEV-001"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Barcode
                </label>
                <Input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="8991234..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Kategori
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                >
                  {categories
                    .filter((c) => c.id !== 'all')
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Satuan Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-zinc-300 rounded-lg text-zinc-900"
                >
                  <option value="cup">cup</option>
                  <option value="pcs">pcs</option>
                  <option value="porsi">porsi</option>
                  <option value="botol">botol</option>
                  <option value="paket">paket</option>
                </select>
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Harga Pokok / Modal (Rp)
                </label>
                <Input
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Harga Jual Kasir (Rp) *
                </label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Stocks */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Kuantitas Stok Saat Ini
                </label>
                <Input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Batas Min. Stok (Peringatan)
                </label>
                <Input
                  type="number"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Deskripsi Produk (Opsional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Keterangan bahan baku atau keunggulan menu..."
            className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-950"
          />
        </div>

        <div className="flex gap-2 pt-3 border-t border-zinc-100">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" className="flex-1 font-semibold">
            {isEditing ? 'Simpan Perubahan' : 'Tambah ke Katalog'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
