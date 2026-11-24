export interface OCRExtractedItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  subtotal: number
  confidence: number // e.g. 0.96 for 96%
  matchedProductId?: string
}

export type OCRScanStep = 'idle' | 'uploading' | 'processing' | 'reviewed' | 'saved'

export interface BookkeepingPreset {
  id: string
  title: string
  subtitle: string
  image: string
  items: OCRExtractedItem[]
  notes?: string
}
