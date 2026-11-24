import React from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { OCRBookkeepingFeature } from '../features/ocr-bookkeeping/OCRBookkeepingFeature'

export const OCRBookkeepingPage: React.FC = () => {
  return (
    <PageContainer
      title="OCR Pembukuan & Catatan Transaksi"
      subtitle="Pindai foto catatan tulisan tangan untuk ekstraksi otomatis transaksi ke sistem POS"
    >
      <div className="p-4 sm:p-6 max-w-6xl mx-auto w-full">
        <OCRBookkeepingFeature />
      </div>
    </PageContainer>
  )
}
