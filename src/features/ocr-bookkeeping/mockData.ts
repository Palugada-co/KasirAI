import { BookkeepingPreset, OCRExtractedItem } from './types'

export const DEFAULT_EXTRACTED_ITEMS: OCRExtractedItem[] = [
  {
    id: 'ocr-item-1',
    name: 'Kopi Susu Gula Aren',
    quantity: 1,
    unitPrice: 18000,
    subtotal: 18000,
    confidence: 0.98,
    matchedProductId: 'prod-1',
  },
  {
    id: 'ocr-item-2',
    name: 'Nasi Goreng Spesial',
    quantity: 1,
    unitPrice: 32000,
    subtotal: 32000,
    confidence: 0.95,
    matchedProductId: 'prod-6',
  },
  {
    id: 'ocr-item-3',
    name: 'Cinnamon Roll Glaze',
    quantity: 1,
    unitPrice: 22000,
    subtotal: 22000,
    confidence: 0.97,
    matchedProductId: 'prod-5',
  },
]

// An SVG image representing a lined handwritten ledger notebook page
export const SAMPLE_LEDGER_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 850" width="700" height="850">
  <defs>
    <linearGradient id="paper" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffbf0"/>
      <stop offset="100%" stop-color="#f5eedc"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="4" stdDeviation="4" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Paper background -->
  <rect x="20" y="20" width="660" height="810" rx="16" fill="url(#paper)" filter="url(#shadow)" stroke="#e2d9c8" stroke-width="2"/>

  <!-- Red margin line -->
  <line x1="140" y1="20" x2="140" y2="830" stroke="#fca5a5" stroke-width="2" stroke-dasharray="2,2"/>

  <!-- Horizontal notebook lines -->
  <g stroke="#cbd5e1" stroke-width="1.2" opacity="0.65">
    <line x1="40" y1="90" x2="660" y2="90"/>
    <line x1="40" y1="140" x2="660" y2="140"/>
    <line x1="40" y1="190" x2="660" y2="190"/>
    <line x1="40" y1="240" x2="660" y2="240"/>
    <line x1="40" y1="290" x2="660" y2="290"/>
    <line x1="40" y1="340" x2="660" y2="340"/>
    <line x1="40" y1="390" x2="660" y2="390"/>
    <line x1="40" y1="440" x2="660" y2="440"/>
    <line x1="40" y1="490" x2="660" y2="490"/>
    <line x1="40" y1="540" x2="660" y2="540"/>
    <line x1="40" y1="590" x2="660" y2="590"/>
    <line x1="40" y1="640" x2="660" y2="640"/>
    <line x1="40" y1="690" x2="660" y2="690"/>
    <line x1="40" y1="740" x2="660" y2="740"/>
  </g>

  <!-- Handwritten Header -->
  <text x="160" y="80" font-family="'Caveat', 'Segoe Print', 'Comic Sans MS', cursive, sans-serif" font-size="28" font-weight="bold" fill="#1e293b" transform="rotate(-0.8 160 80)">
    Catatan Penjualan Harian - PaluPay
  </text>
  <text x="160" y="130" font-family="'Caveat', 'Segoe Print', cursive, sans-serif" font-size="20" fill="#475569">
    Shift Pagi - Order Meja 07
  </text>

  <!-- Items (Handwritten style) -->
  <g font-family="'Caveat', 'Segoe Print', 'Bradley Hand', cursive, sans-serif" fill="#0f172a">
    <!-- Item 1 -->
    <text x="160" y="232" font-size="23" font-weight="600" transform="rotate(0.4 160 232)">
      1. Kopi Susu Gula Aren
    </text>
    <text x="460" y="232" font-size="21" fill="#334155">
      1 x 18.000 =
    </text>
    <text x="560" y="232" font-size="23" font-weight="bold">
      18.000
    </text>

    <!-- Item 2 -->
    <text x="160" y="332" font-size="23" font-weight="600" transform="rotate(-0.3 160 332)">
      2. Nasi Goreng Spesial
    </text>
    <text x="460" y="332" font-size="21" fill="#334155">
      1 x 32.000 =
    </text>
    <text x="560" y="332" font-size="23" font-weight="bold">
      32.000
    </text>

    <!-- Item 3 -->
    <text x="160" y="432" font-size="23" font-weight="600" transform="rotate(0.5 160 432)">
      3. Cinnamon Roll Glaze
    </text>
    <text x="460" y="432" font-size="21" fill="#334155">
      1 x 22.000 =
    </text>
    <text x="560" y="432" font-size="23" font-weight="bold">
      22.000
    </text>

    <!-- Divider -->
    <line x1="450" y1="465" x2="640" y2="465" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>

    <!-- Total -->
    <text x="380" y="532" font-size="24" font-weight="bold" fill="#0f172a" transform="rotate(-0.5 380 532)">
      TOTAL =
    </text>
    <text x="550" y="532" font-size="26" font-weight="bold" fill="#047857">
      Rp 72.000
    </text>

    <!-- Cashier note -->
    <text x="160" y="632" font-size="19" fill="#64748b" transform="rotate(0.3 160 632)">
      * Pembayaran: Tunai / Cash (Uang Pas)
    </text>
    <text x="160" y="682" font-size="18" fill="#94a3b8">
      Dicatat oleh: Kasir PaluPay
    </text>
  </g>
</svg>
`)}`

export const BOOKKEEPING_PRESETS: BookkeepingPreset[] = [
  {
    id: 'preset-cafe-daily',
    title: 'Catatan Penjualan Harian Kafe',
    subtitle: '3 item pesanan kasir meja (Kopi, Makanan, Pastry)',
    image: SAMPLE_LEDGER_IMAGE,
    items: DEFAULT_EXTRACTED_ITEMS,
    notes: 'Catatan tulisan tangan kasir shift pagi',
  },
  {
    id: 'preset-ingredient-purchase',
    title: 'Log Pembelian Bahan Baku Dapur',
    subtitle: 'Log pengadaan susu fresh milk, biji kopi, & sirup aren',
    image: SAMPLE_LEDGER_IMAGE,
    items: [
      {
        id: 'ocr-exp-1',
        name: 'Fresh Milk Pasteurisasi 1L (x5)',
        quantity: 5,
        unitPrice: 21000,
        subtotal: 105000,
        confidence: 0.96,
      },
      {
        id: 'ocr-exp-2',
        name: 'Biji Kopi Arabica Blend 1kg',
        quantity: 2,
        unitPrice: 125000,
        subtotal: 250000,
        confidence: 0.94,
      },
      {
        id: 'ocr-exp-3',
        name: 'Gula Aren Cair Organik 1L',
        quantity: 3,
        unitPrice: 38000,
        subtotal: 114000,
        confidence: 0.98,
      },
    ],
    notes: 'Belanja harian pasar induk & supplier',
  },
]
