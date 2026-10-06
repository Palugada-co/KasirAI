import React from 'react'
import { Product } from '../../types'
import { ProductCard } from './ProductCard'
import { PackageSearch, Sparkles } from 'lucide-react'

interface ProductGridProps {
  products: Product[]
  cartQuantities: Record<string, number>
  onAddToCart: (product: Product) => void
  onClearFilters?: () => void
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  cartQuantities,
  onAddToCart,
  onClearFilters,
}) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-zinc-200">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
          <PackageSearch className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-zinc-900 mb-1">
          Tidak ada produk yang cocok
        </h3>
        <p className="text-xs text-zinc-500 max-w-sm mb-4">
          Coba periksa kata kunci pencarian atau ubah filter kategori yang dipilih.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs font-semibold text-zinc-900 underline hover:text-zinc-700 cursor-pointer"
          >
            Tampilkan Semua Produk
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          cartQuantity={cartQuantities[product.id] || 0}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
