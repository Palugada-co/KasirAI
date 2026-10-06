import React, { useState, useMemo } from 'react'
import { Product } from '../../types'
import { StockBadge } from '../../components/ui/StockBadge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { formatRupiah, cn } from '../../lib/utils'
import {
  Search,
  Plus,
  SlidersHorizontal,
  ArrowUpDown,
  Edit2,
  Trash2,
  RotateCcw,
  Boxes,
  ArrowUpRight,
  ArrowDownRight,
  Package,
} from 'lucide-react'

interface InventoryTableProps {
  products: Product[]
  onOpenAddModal: () => void
  onOpenEditModal: (product: Product) => void
  onOpenAdjustModal: (product: Product) => void
  onDeleteProduct: (id: string) => void
  onResetData: () => void
}

type StockFilterType = 'all' | 'in-stock' | 'limited' | 'out-of-stock'
type SortField = 'name' | 'price' | 'stock'
type SortOrder = 'asc' | 'desc'

export const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  onOpenAddModal,
  onOpenEditModal,
  onOpenAdjustModal,
  onDeleteProduct,
  onResetData,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState<StockFilterType>('all')
  const [sortField, setSortField] = useState<SortField>('stock')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.categoryName))
    return ['all', ...Array.from(set)]
  }, [products])

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.barcode.includes(searchTerm)

        const matchesCategory =
          categoryFilter === 'all' || p.categoryName === categoryFilter

        let matchesStock = true
        if (stockFilter === 'out-of-stock') {
          matchesStock = p.stock <= 0
        } else if (stockFilter === 'limited') {
          matchesStock = p.stock > 0 && p.stock <= p.minStock
        } else if (stockFilter === 'in-stock') {
          matchesStock = p.stock > p.minStock
        }

        return matchesSearch && matchesCategory && matchesStock
      })
      .sort((a, b) => {
        let valA: string | number = a[sortField]
        let valB: string | number = b[sortField]

        if (typeof valA === 'string') {
          valA = valA.toLowerCase()
          valB = (valB as string).toLowerCase()
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
  }, [products, searchTerm, categoryFilter, stockFilter, sortField, sortOrder])

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, currentPage, pageSize])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // Stock summary stats for quick badges
  const totalSku = products.length
  const outOfStockCount = products.filter((p) => p.stock <= 0).length
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.minStock).length
  const safeStockCount = products.filter((p) => p.stock > p.minStock).length

  return (
    <div className="space-y-4">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setStockFilter('all')}
          className={cn(
            'p-3.5 rounded-xl border text-left transition-all cursor-pointer',
            stockFilter === 'all'
              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
              : 'bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50'
          )}
        >
          <span className="text-[11px] block opacity-75 font-medium">Total Katalog SKU</span>
          <span className="text-xl font-extrabold">{totalSku} Produk</span>
        </button>

        <button
          onClick={() => setStockFilter('in-stock')}
          className={cn(
            'p-3.5 rounded-xl border text-left transition-all cursor-pointer',
            stockFilter === 'in-stock'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
              : 'bg-white border-emerald-200 text-emerald-800 hover:bg-emerald-50'
          )}
        >
          <span className="text-[11px] block opacity-80 font-medium">Stok Aman</span>
          <span className="text-xl font-extrabold">{safeStockCount} Produk</span>
        </button>

        <button
          onClick={() => setStockFilter('limited')}
          className={cn(
            'p-3.5 rounded-xl border text-left transition-all cursor-pointer',
            stockFilter === 'limited'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-white border-amber-200 text-amber-800 hover:bg-amber-50'
          )}
        >
          <span className="text-[11px] block opacity-80 font-medium">Stok Menipis</span>
          <span className="text-xl font-extrabold">{lowStockCount} Produk</span>
        </button>

        <button
          onClick={() => setStockFilter('out-of-stock')}
          className={cn(
            'p-3.5 rounded-xl border text-left transition-all cursor-pointer',
            stockFilter === 'out-of-stock'
              ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
              : 'bg-white border-rose-200 text-rose-800 hover:bg-rose-50'
          )}
        >
          <span className="text-[11px] block opacity-80 font-medium">Stok Habis (0)</span>
          <span className="text-xl font-extrabold">{outOfStockCount} Produk</span>
        </button>
      </div>

      {/* Action Bar (Search, Filters, Add Button) */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Cari nama barang, SKU, atau barcode..."
              className="w-full h-10 pl-9 pr-4 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-colors"
            />
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onResetData}
              title="Reset data ke bawaan awal"
              className="text-xs text-zinc-600"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1 text-zinc-500" />
              <span className="hidden md:inline">Reset Demo</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={onOpenAddModal}
              className="text-xs font-semibold gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk</span>
            </Button>
          </div>
        </div>

        {/* Filter Tags / Category Dropdown */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-100 text-xs">
          <span className="text-zinc-400 font-medium">Kategori:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat)
                setCurrentPage(1)
              }}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                categoryFilter === cat
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              )}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/75 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                <th
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-4 cursor-pointer hover:text-zinc-900 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Produk</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">SKU / Barcode</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3.5 px-4 cursor-pointer hover:text-zinc-900 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Harga Jual / Modal</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('stock')}
                  className="py-3.5 px-4 cursor-pointer hover:text-zinc-900 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status Stok</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    Tidak ada produk yang memenuhi kriteria pencarian
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const marginPct =
                    p.price > 0
                      ? Math.round(((p.price - p.buyPrice) / p.price) * 100)
                      : 0

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-zinc-50/80 transition-colors group"
                    >
                      {/* Name & Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-zinc-100 shrink-0 border border-zinc-200"
                          />
                          <div>
                            <div className="font-bold text-zinc-900">{p.name}</div>
                            {p.description && (
                              <p className="text-[11px] text-zinc-400 truncate max-w-xs">
                                {p.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* SKU & Barcode */}
                      <td className="py-3 px-4 font-mono text-zinc-600">
                        <div>{p.sku}</div>
                        <div className="text-[10px] text-zinc-400">{p.barcode}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded text-[11px] font-medium">
                          {p.categoryName}
                        </span>
                      </td>

                      {/* Prices & Margin */}
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-zinc-900">
                          {formatRupiah(p.price)}
                        </div>
                        <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                          <span>Modal: {formatRupiah(p.buyPrice)}</span>
                          <span className="text-emerald-600 font-semibold">
                            (+{marginPct}%)
                          </span>
                        </div>
                      </td>

                      {/* Stock Badge with real-time reactive component */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <StockBadge
                            stock={p.stock}
                            minStock={p.minStock}
                            unit={p.unit}
                            showQuantity={true}
                          />
                          <div className="text-[10px] text-zinc-400">
                            Min. batas: {p.minStock} {p.unit}
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onOpenAdjustModal(p)}
                            title="Penyesuaian Stok Cepat"
                            className="text-[11px] h-7 px-2 font-semibold text-zinc-800"
                          >
                            <Boxes className="w-3 h-3 mr-1 text-zinc-600" />
                            <span>Stok</span>
                          </Button>

                          <button
                            onClick={() => onOpenEditModal(p)}
                            title="Ubah Produk"
                            className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (
                                window.confirm(`Hapus produk "${p.name}" dari inventori?`)
                              ) {
                                onDeleteProduct(p.id)
                              }
                            }}
                            title="Hapus Produk"
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="py-3 px-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500 bg-zinc-50/50">
          <div>
            Menampilkan{' '}
            <span className="font-semibold text-zinc-900">
              {filteredProducts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{' '}
            -{' '}
            <span className="font-semibold text-zinc-900">
              {Math.min(currentPage * pageSize, filteredProducts.length)}
            </span>{' '}
            dari <span className="font-semibold text-zinc-900">{filteredProducts.length}</span> barang
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-8 text-xs"
            >
              Sebelumnya
            </Button>
            <span className="px-2 text-xs font-semibold text-zinc-800">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-8 text-xs"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
