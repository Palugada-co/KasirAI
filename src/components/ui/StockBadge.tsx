import React from 'react'
import { Badge } from './Badge'
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react'

interface StockBadgeProps {
  stock: number
  minStock: number
  unit?: string
  showQuantity?: boolean
}

export const StockBadge: React.FC<StockBadgeProps> = ({
  stock,
  minStock,
  unit = 'pcs',
  showQuantity = true,
}) => {
  if (stock <= 0) {
    return (
      <Badge variant="danger" className="gap-1 font-semibold">
        <XCircle className="w-3.5 h-3.5 text-rose-600" />
        <span>Habis</span>
        {showQuantity && <span className="opacity-75 font-normal">({stock} {unit})</span>}
      </Badge>
    )
  }

  if (stock <= minStock) {
    return (
      <Badge variant="warning" className="gap-1 font-semibold">
        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
        <span>Menipis</span>
        {showQuantity && <span className="opacity-80 font-normal">({stock} {unit})</span>}
      </Badge>
    )
  }

  return (
    <Badge variant="success" className="gap-1">
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      <span>Aman</span>
      {showQuantity && <span className="opacity-80 font-normal">({stock} {unit})</span>}
    </Badge>
  )
}
