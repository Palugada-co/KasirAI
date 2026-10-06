import React, { useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { InventoryTable } from '../features/inventory/InventoryTable'
import { AddEditProductModal } from '../features/inventory/AddEditProductModal'
import { StockAdjustmentModal } from '../features/inventory/StockAdjustmentModal'
import { useInventoryStore } from '../store/useInventoryStore'
import { useToast } from '../components/shared/Toast'
import { Product } from '../types'

export const InventoryPage: React.FC = () => {
  const { products, deleteProduct, resetToDefault } = useInventoryStore()
  const { showToast } = useToast()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [productToAdjust, setProductToAdjust] = useState<Product | null>(null)

  const handleOpenEdit = (product: Product) => {
    setProductToEdit(product)
  }

  const handleOpenAdjust = (product: Product) => {
    setProductToAdjust(product)
  }

  const handleDelete = (id: string) => {
    deleteProduct(id)
    showToast('Produk Dihapus', 'Data produk telah dihapus dari sistem inventori', 'info')
  }

  const handleResetData = () => {
    if (window.confirm('Kembalikan seluruh data produk ke preset mock awal?')) {
      resetToDefault()
      showToast('Data Direset', 'Katalog kembali ke data awal', 'success')
    }
  }

  return (
    <PageContainer
      title="Manajemen Inventori & Stok"
      subtitle="Pantau ketersediaan stok produk, peringatan restock, dan opname fisik"
    >
      <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <InventoryTable
          products={products}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenEditModal={handleOpenEdit}
          onOpenAdjustModal={handleOpenAdjust}
          onDeleteProduct={handleDelete}
          onResetData={handleResetData}
        />
      </div>

      {/* Add / Edit Product Modal */}
      <AddEditProductModal
        isOpen={isAddModalOpen || !!productToEdit}
        onClose={() => {
          setIsAddModalOpen(false)
          setProductToEdit(null)
        }}
        productToEdit={productToEdit}
      />

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={!!productToAdjust}
        onClose={() => setProductToAdjust(null)}
        product={productToAdjust}
      />
    </PageContainer>
  )
}
