import React from 'react'
import { Product } from '../../types'
import { StockBadge } from '../../components/ui/StockBadge'
import { formatRupiah, cn } from '../../lib/utils'
import { Plus, Check } from 'lucide-react'

interface ProductCardProps {
  product: Product
  cartQuantity?: number
  onAddToCart: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQuantity = 0,
  onAddToCart,
}) => {
  const isOutOfStock = product.stock <= 0
  const isMaxInCart = cartQuantity >= product.stock

  const handleClick = () => {
    if (isOutOfStock || isMaxInCart) return
    onAddToCart(product)
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative bg-white rounded-2xl border border-[#E5E7EB] p-3 flex flex-col justify-between transition-all select-none',
        isOutOfStock
          ? 'opacity-60 cursor-not-allowed bg-zinc-50'
          : isMaxInCart
          ? 'border-amber-200 cursor-not-allowed'
          : 'hover:shadow-md hover:border-zinc-300 cursor-pointer active:scale-[0.98]'
      )}
    >
      <div>
        {/* Thumbnail Image */}
        <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-zinc-100 mb-3">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback image if unsplash link fails
              ;(e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60'
            }}
          />

          {/* Stock Badge overlay */}
          <div className="absolute top-2 left-2">
            <StockBadge
              stock={product.stock}
              minStock={product.minStock}
              unit={product.unit}
              showQuantity={false}
            />
          </div>

          {/* Cart Quantity indicator pill */}
          {cartQuantity > 0 && (
            <div className="absolute top-2 right-2 bg-zinc-900 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 animate-scale-up">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>{cartQuantity}x</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>{product.sku}</span>
            <span className="font-medium text-zinc-500">{product.stock} {product.unit} tersisa</span>
          </div>
          <h3 className="font-bold text-sm text-zinc-900 leading-snug line-clamp-2 group-hover:text-zinc-950">
            {product.name}
          </h3>
        </div>
      </div>

      {/* Price & Add Button */}
      <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-zinc-400 block font-medium">Harga Satuan</span>
          <span className="text-sm font-extrabold text-zinc-900">
            {formatRupiah(product.price)}
          </span>
        </div>

        <button
          disabled={isOutOfStock || isMaxInCart}
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
            isOutOfStock
              ? 'bg-zinc-200 text-zinc-400'
              : isMaxInCart
              ? 'bg-amber-100 text-amber-700 font-bold text-xs'
              : 'bg-zinc-100 text-zinc-800 group-hover:bg-[#18181B] group-hover:text-white'
          )}
          aria-label={`Tambah ${product.name}`}
        >
          {isMaxInCart ? 'Max' : <Plus className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
