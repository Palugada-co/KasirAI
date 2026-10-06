# Dokumentasi Spesifikasi Frontend POS (React Tech Stack)

## 1. Technological Stack Recommendations

* **Core Framework:** React 18+ (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (untuk eksekusi *design system* minimalis & netral)
* **UI Component Library:** Shadcn UI / Radix UI (Headless & unstyled, mudah disesuaikan dengan warna netral)
* **Icons:** Lucide React
* **State Management:** 
  * Zustand (Global State: Cart, Active Shift, Cashier Session)
  * TanStack Query / React Query (Data Fetching & Caching)
* **Routing:** React Router v6
* **Form Handling:** React Hook Form + Zod (Validation)

---

## 2. Design System & Style Guidelines

* **Theme Concept:** Minimalist, Neutral, High-Contrast Readability.
* **Color Palette (Tailwind Configuration):**
  * `bg-background`: `#FAFAFA` (Off-white canvas)
  * `bg-surface`: `#FFFFFF` (Card & Modal background)
  * `text-primary`: `#111827` (Zinc/Gray 900)
  * `text-muted`: `#6B7280` (Zinc/Gray 500)
  * `border-default`: `#E5E7EB` (Gray 200)
  * `btn-primary`: `#18181B` (Zinc 900) - Dark Accent
  * `btn-secondary`: `#F4F4F5` (Zinc 100)
  * `status-success`: `#10B981` (Muted Emerald)
  * `status-warning`: `#F59E0B` (Muted Amber)
  * `status-danger`: `#EF4444` (Muted Rose)

---

## 3. Project Directory Structure (React)

```text
src/
├── assets/             # Media, Logo, Static Icons
├── components/         # Reusable UI Components
│   ├── ui/             # Buttons, Inputs, Cards, Dialogs, Badges (Shadcn/Tailwind)
│   ├── layout/         # Sidebar, Header, PageContainer
│   └── shared/         # Toast, Loading, ConfirmModal
├── features/           # Feature-based Modular Architecture
│   ├── auth/           # Login & Register Forms, AuthGuard
│   ├── cashier/        # ProductGrid, Cart, PaymentModal, ReceiptPreview
│   ├── inventory/      # ProductTable, StockAdjustmentModal, AddProductModal
│   ├── dashboard/      # StatCards, SalesChart, RecentTransactions
│   └── ai-assistant/   # ChatWindow, MessageBubble, PromptSuggestions
├── hooks/              # Custom React Hooks (useCart, useThermalPrinter, useScanner)
├── store/              # Zustand Stores (useCartStore, useUserStore)
├── types/              # TypeScript Interfaces & Types
├── pages/              # Page Components linked to React Router
└── routes/             # Router Configuration
```

---

## 4. Kebutuhan Komponen & Halaman Prototype

### 4.1. Authentication (`/login` & `/register`)
* **Components:** `LoginForm`, `RegisterForm`, `AuthLayout`.
* **Behavior (Prototype):**
  * Validasi input menggunakan React Hook Form.
  * *Mock auth submission* yang menyimpan *dummy token* di `localStorage` dan meredirect ke `/cashier`.

### 4.2. Kasir / Point of Sale (`/cashier`)
* **Components:**
  * `SearchBar` dengan *shortcut focus* (`Ctrl + K` / `Cmd + K`).
  * `CategoryFilter`: Scroll horizontal tag kategori.
  * `ProductCard`: Thumbnail, Nama, Harga, Indicator Stok.
  * `CartPanel`: Sidebar kanan fleksibel dengan daftar item, tombol (+ / - / delete), kalkulasi subtotal, diskon, dan pajak.
  * `PaymentModal`: Pilihan metode bayar (Cash, QRIS, Card), kalkulator kembalian otomatis.
  * `ReceiptModal`: Preview struk ukuran 58mm/80mm + tombol simulasi *Print*.
* **State Management (`useCartStore` - Zustand):**
  * `cartItems`: Array of items.
  * `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`.
  * `applyDiscount()`, `taxAmount`.

### 4.3. Inventori & Stok (`/inventory`)
* **Components:**
  * `InventoryTable`: TanStack Table dengan fitur sortir, pagination, dan *search*.
  * `StockBadge`: Badge status (Aman = Neutral/Green, Limited = Amber, Out of Stock = Red).
  * `AddEditProductModal`: Form input produk lengkap dengan upload preview gambar.
* **Behavior (Prototype):**
  * Menyediakan data *mock* (JSON) yang dapat ditambah/diedit secara lokal dalam memori state.

### 4.4. Dashboard & Analisis (`/dashboard`)
* **Components:**
  * `MetricCard`: Ringkasan omzet, total transaksi, dan produk terlaris.
  * `SalesChart`: Menggunakan **Recharts** / **Chart.js** dengan *line chart* atau *bar chart* bergaya minimalis (monokrom/netral).
  * `RecentTransactionTable`: Ringkasan 5 transaksi terakhir.

### 4.5. AI Assistant & OpenClaw Chatbox (`/ai-assistant`)
* **Components:**
  * `ChatContainer`: Layout perpesanan bergaya WhatsApp/Modern Chat.
  * `MessageList`: Render pesan (User vs AI System).
  * `QuickPromptChip`: Tombol prompt cepat (misal: "Berapa omzet hari ini?", "Barang apa yang stoknya mau habis?").
  * `ChatInput`: Input teks + tombol *send*.
* **Simulasi Integrasi (n8n & OpenClaw):**
  * Pada *prototype frontend*, komponen ini memiliki fungsi simulasi respon (*mock response*) dengan penundaan waktu (1-2 detik) untuk menirukan panggilan webhook n8n/OpenClaw.
  * Menyediakan variabel *endpoint webhook* di `.env` (`VITE_N8N_CHATBOT_WEBHOOK_URL`) yang siap dihubungkan ke backend n8n asli di kemudian hari.

---

## 5. Rencana Pengujian Prototype (Frontend)

1. **Simulasi Flow Kasir:** Pelanggan memilih produk -> Masuk Keranjang -> Ubah Qty -> Pilih Pembayaran QRIS -> Modal Struk Muncul -> Cetak.
2. **Simulasi Manajemen Stok:** Pengguna mengubah kuantitas stok barang di Halaman Inventori -> Status badge otomatis terbarui.
3. **Simulasi Interaction Chat AI:** Pengguna mengeklik quick prompt "Cek Omzet" -> Chatbot membalas dengan format ringkasan data POS.