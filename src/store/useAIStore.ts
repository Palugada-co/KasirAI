import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ChatMessage, QuickPrompt } from '../types'
import { useTransactionStore } from './useTransactionStore'
import { useInventoryStore } from './useInventoryStore'
import { formatRupiah } from '../lib/utils'

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'qp-1',
    label: 'Cek Omzet Hari Ini',
    prompt: 'Berapa total omzet dan ringkasan transaksi hari ini?',
    category: 'sales',
    icon: 'TrendingUp',
  },
  {
    id: 'qp-2',
    label: 'Cek Stok Menipis',
    prompt: 'Barang apa saja yang stoknya hampir habis atau kosong?',
    category: 'inventory',
    icon: 'AlertTriangle',
  },
  {
    id: 'qp-3',
    label: 'Produk Paling Laris',
    prompt: 'Apa produk paling laris dan rekomendasi menu unggulan?',
    category: 'sales',
    icon: 'Flame',
  },
  {
    id: 'qp-4',
    label: 'Ide Promo Bundle',
    prompt: 'Buatkan ide promo paket bundling hemat untuk kopi dan pastry.',
    category: 'promo',
    icon: 'Sparkles',
  },
  {
    id: 'qp-5',
    label: 'Status Shift Kasir',
    prompt: 'Bagaimana status shift kasir aktif saat ini dan saldo laci kas?',
    category: 'shift',
    icon: 'Clock',
  },
]

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    content: `Halo! Saya **KasirAI Assistant (OpenClaw Engine)**. 

Saya terhubung langsung dengan sistem kasir, data transaksi real-time, dan stok inventori toko Anda. Ada yang bisa saya bantu analisa hari ini?`,
    timestamp: new Date().toISOString(),
    metadata: {
      type: 'general',
    },
  },
]

interface AIState {
  messages: ChatMessage[]
  isLoading: boolean
  webhookUrl: string
  sendMessage: (content: string) => Promise<void>
  clearHistory: () => void
  setWebhookUrl: (url: string) => void
}

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      messages: INITIAL_MESSAGES,
      isLoading: false,
      webhookUrl: (import.meta.env.VITE_N8N_CHATBOT_WEBHOOK_URL as string) || '',

      sendMessage: async (content: string) => {
        const userMsg: ChatMessage = {
          id: 'msg-' + Date.now(),
          sender: 'user',
          content,
          timestamp: new Date().toISOString(),
        }

        set((state) => ({
          messages: [...state.messages, userMsg],
          isLoading: true,
        }))

        const transactionState = useTransactionStore.getState()
        const inventoryState = useInventoryStore.getState()

        // 1. Try external webhook if defined
        const customWebhook = get().webhookUrl
        let replyText = ''
        let metadataType: 'sales-summary' | 'stock-alert' | 'recommendation' | 'general' = 'general'

        if (customWebhook && customWebhook.startsWith('http')) {
          try {
            const res = await fetch(customWebhook, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: content,
                context: {
                  todaySales: transactionState.getTodayTotalSales(),
                  totalTransactions: transactionState.getTodayTransactions().length,
                  productsCount: inventoryState.products.length,
                },
              }),
            })
            if (res.ok) {
              const data = await res.json()
              replyText = data.output || data.text || data.message || JSON.stringify(data)
            }
          } catch (err) {
            console.warn('Webhook failed, using intelligent local engine:', err)
          }
        }

        // 2. Fallback to Local Intelligent Assistant with realistic 1-1.5s delay
        if (!replyText) {
          await new Promise((resolve) => setTimeout(resolve, 1100))

          const lower = content.toLowerCase()

          // Intent: Sales & Revenue
          if (lower.includes('omzet') || lower.includes('penjualan') || lower.includes('transaksi') || lower.includes('uang')) {
            metadataType = 'sales-summary'
            const todayTrx = transactionState.getTodayTransactions()
            const total = transactionState.getTodayTotalSales()
            const cashTotal = todayTrx.filter((t) => t.paymentMethod === 'cash').reduce((s, t) => s + t.total, 0)
            const qrisTotal = todayTrx.filter((t) => t.paymentMethod === 'qris').reduce((s, t) => s + t.total, 0)
            const cardTotal = todayTrx.filter((t) => t.paymentMethod === 'card').reduce((s, t) => s + t.total, 0)
            const avgTicket = todayTrx.length ? Math.round(total / todayTrx.length) : 0

            replyText = `📊 **Ringkasan Penjualan Hari Ini:**

• **Total Omzet:** **${formatRupiah(total)}**
• **Jumlah Transaksi:** **${todayTrx.length} struk**
• **Rata-rata Keranjang (AOV):** **${formatRupiah(avgTicket)}**

**Rincian Metode Pembayaran:**
- 💵 **Tunai (Cash):** ${formatRupiah(cashTotal)}
- 📱 **QRIS:** ${formatRupiah(qrisTotal)}
- 💳 **Kartu Debit/Kredit:** ${formatRupiah(cardTotal)}

💡 *Insight:* Transaksi QRIS menyumbang porsi besar. Pastikan kode QRIS kasir selalu terpajang rapi dan bersih.`
          }
          // Intent: Inventory & Low Stock
          else if (lower.includes('stok') || lower.includes('habis') || lower.includes('gudang') || lower.includes('sisa')) {
            metadataType = 'stock-alert'
            const outOfStock = inventoryState.products.filter((p) => p.stock <= 0)
            const lowStock = inventoryState.products.filter((p) => p.stock > 0 && p.stock <= p.minStock)
            const safeStock = inventoryState.products.filter((p) => p.stock > p.minStock)

            let outList = outOfStock.length
              ? outOfStock.map((p) => `  ❌ **${p.name}** (0 ${p.unit}) - *HABIS*`).join('\n')
              : '  ✅ *Tidak ada produk yang habis total.*'

            let lowList = lowStock.length
              ? lowStock.map((p) => `  ⚠️ **${p.name}** (Sisa: ${p.stock} ${p.unit}, Min: ${p.minStock})`).join('\n')
              : '  ✅ *Tidak ada produk mendekati batas minimum.*'

            replyText = `📦 **Laporan Status Stok Real-time:**

**Stok Kosong (Perlu Restock Segera):**
${outList}

**Stok Menipis (Hampir Habis):**
${lowList}

**Kondisi Keseluruhan:**
• Total SKU Aktif: **${inventoryState.products.length} item**
• Stok Aman: **${safeStock.length} item**

💡 *Saran AI:* Segera buat Purchase Order untuk item berstatus merah agar operasional jam sibuk tidak terganggu.`
          }
          // Intent: Best Seller Products
          else if (lower.includes('laris') || lower.includes('favorit') || lower.includes('unggul') || lower.includes('populer')) {
            metadataType = 'recommendation'
            const salesMap: Record<string, { name: string; qty: number; revenue: number }> = {}

            transactionState.transactions.forEach((t) => {
              t.items.forEach((item) => {
                const id = item.product.id
                if (!salesMap[id]) {
                  salesMap[id] = { name: item.product.name, qty: 0, revenue: 0 }
                }
                salesMap[id].qty += item.quantity
                salesMap[id].revenue += item.quantity * item.product.price
              })
            })

            const sorted = Object.values(salesMap).sort((a, b) => b.qty - a.qty).slice(0, 4)

            const list = sorted.length
              ? sorted.map((s, idx) => `${idx + 1}. **${s.name}** — Terjual: **${s.qty}x** (${formatRupiah(s.revenue)})`).join('\n')
              : '1. **Kopi Susu Gula Aren**\n2. **Nasi Goreng Spesial KasirAI**\n3. **Butter Croissant Artisanal**'

            replyText = `🔥 **Peringkat Menu Paling Laris:**

${list}

💡 *Rekomendasi:* Buat etalase kasir memajang produk nomor 1 & 2 di posisi paling mudah dilihat, serta tawarkan 'add-on' saat kasir melayani pesanan.`
          }
          // Intent: Promo & Bundling
          else if (lower.includes('promo') || lower.includes('bundle') || lower.includes('paket') || lower.includes('diskon')) {
            metadataType = 'recommendation'
            replyText = `✨ **Rekomendasi Paket Bundling KasirAI:**

1. ☕🥐 **"Paket Ngopi Santai"**
   - 1x Kopi Susu Gula Aren (Rp 18.000)
   - 1x Butter Croissant (Rp 24.000)
   - *Harga Normal:* Rp 42.000
   - **Harga Bundle Promo:** **Rp 35.000** *(Diskon ~16%)*
   - *Perkiraan Margin Laba:* ~45%

2. 🍛🥤 **"Paket Kenyang Siang"**
   - 1x Nasi Goreng Spesial KasirAI (Rp 32.000)
   - 1x Ice Tea / Americano (Rp 22.000)
   - *Harga Normal:* Rp 54.000
   - **Harga Bundle Promo:** **Rp 45.000**

👉 *Tips:* Anda bisa langsung menambahkan menu bundle ini di menu **Inventori** kategori **Paket Hemat**!`
          }
          // Intent: Cashier Shift
          else if (lower.includes('shift') || lower.includes('laci') || lower.includes('kasir')) {
            const shift = transactionState.activeShift
            replyText = `🕒 **Status Shift Kasir Aktif:**

• **Kasir Bertugas:** ${shift.cashierName}
• **Waktu Buka Shift:** ${new Date(shift.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
• **Modal Awal Kas:** ${formatRupiah(shift.startingCash)}
• **Total Penjualan Tunai:** ${formatRupiah(shift.cashSales)}
• **Total Penjualan Non-Tunai:** ${formatRupiah(shift.qrisSales + shift.cardSales)}
• **Ekspektasi Uang Fisik di Laci:** **${formatRupiah(shift.startingCash + shift.cashSales)}**
• **Status:** ${shift.status === 'open' ? '🟢 Aktif / Terbuka' : '🔴 Ditutup'}

💡 *Ingat:* Selalu hitung fisik uang di laci sebelum menekan tombol Tutup Shift.`
          }
          // Default response
          else {
            replyText = `Terima kasih atas pertanyaannya! 

Sebagai asisten pintar **KasirAI**, saya dapat membantu Anda menganalisa:
1. **Omzet & Laporan Penjualan** *(contoh: "Berapa omzet hari ini?")*
2. **Peringatan Stok Barang** *(contoh: "Barang apa yang mau habis?")*
3. **Produk Terlaris** *(contoh: "Apa menu paling laku?")*
4. **Strategi Diskon & Promo** *(contoh: "Buatkan ide paket bundle")*
5. **Ringkasan Shift Kasir** *(contoh: "Cek saldo laci kas")*

Silakan pilih quick prompt di atas atau ketik instruksi spesifik Anda.`
          }
        }

        const assistantMsg: ChatMessage = {
          id: 'msg-' + Date.now(),
          sender: 'assistant',
          content: replyText,
          timestamp: new Date().toISOString(),
          metadata: {
            type: metadataType,
          },
        }

        set((state) => ({
          messages: [...state.messages, assistantMsg],
          isLoading: false,
        }))
      },

      clearHistory: () => {
        set({ messages: INITIAL_MESSAGES })
      },

      setWebhookUrl: (url: string) => {
        set({ webhookUrl: url })
      },
    }),
    {
      name: 'kasirai-ai-chat-storage',
    }
  )
)
