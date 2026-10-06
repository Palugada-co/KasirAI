# KasirAI - Smart Point of Sale (POS) System

Sistem Point of Sale (POS) modern, minimalis, dan cerdas dengan integrasi analisis AI Copilot (OpenClaw / n8n Webhook ready), manajemen stok real-time, dan simulasi cetak struk thermal 58mm/80mm.

---

## 🚀 Tech Stack

* **Core Framework:** React 19 / 18+ (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4 (Desain minimalis, netral & high-contrast)
* **Icons:** Lucide React
* **State Management:** Zustand (Cart, Session Kasir, Inventori, Transaksi, Shift Aktif) & TanStack React Query
* **Routing:** React Router v6 (Lazy code splitting)
* **Form Handling & Validation:** React Hook Form + Zod
* **Charts & Analytics:** Recharts (Area & Bar chart)

---

## 🎨 Design System & Color Palette

* `bg-background`: `#FAFAFA` (Off-white canvas)
* `bg-surface`: `#FFFFFF` (Card & modal background)
* `text-primary`: `#111827` (Zinc/Gray 900)
* `text-muted`: `#6B7280` (Zinc/Gray 500)
* `border-default`: `#E5E7EB` (Gray 200)
* `btn-primary`: `#18181B` (Zinc 900)
* `btn-secondary`: `#F4F4F5` (Zinc 100)
* `status-success`: `#10B981` (Muted Emerald)
* `status-warning`: `#F59E0B` (Muted Amber)
* `status-danger`: `#EF4444` (Muted Rose)

---

## 📂 Struktur Direktori

```text
src/
├── assets/             # Media, Logo, Static Icons
├── components/         # Reusable UI Components
│   ├── ui/             # Button, Input, Card, Modal, Badge, StockBadge
│   ├── layout/         # Sidebar, Header, PageContainer, ShiftModal
│   └── shared/         # Toast provider & notifications
├── features/           # Feature-based Modular Architecture
│   ├── auth/           # LoginForm, RegisterForm, AuthGuard, AuthLayout
│   ├── cashier/        # SearchBar, CategoryFilter, ProductCard, ProductGrid, CartPanel, PaymentModal, ReceiptModal
│   ├── inventory/      # InventoryTable, StockAdjustmentModal, AddEditProductModal
│   ├── dashboard/      # StatCards, SalesChart, RecentTransactions
│   └── ai-assistant/   # ChatWindow, MessageBubble, QuickPromptChip, ChatInput
├── hooks/              # Custom React Hooks (useScanner, useThermalPrinter)
├── store/              # Zustand Stores (useUserStore, useCartStore, useInventoryStore, useTransactionStore, useAIStore)
├── types/              # TypeScript Interfaces & Types
├── pages/              # Halaman Utama (CashierPage, InventoryPage, DashboardPage, AIAssistantPage, LoginPage, RegisterPage)
└── routes/             # React Router v6 Configuration
```

---

## 💡 Fitur Utama

### 1. Autentikasi Kasir & Admin (`/login` & `/register`)
* Validasi form dengan Zod + React Hook Form.
* Demo Login instan untuk akun Kasir atau Admin.
* Sesi tersimpan di local storage dengan proteksi route (`AuthGuard`).

### 2. Kasir / Point of Sale (`/cashier`)
* **Pencarian Cepat & Shortcut:** `Ctrl + K` untuk fokus pencarian.
* **Hardware Barcode Scanner:** Hook `useScanner` mendeteksi ketukan barcode scanner secara otomatis.
* **Filter Kategori & Indikator Stok:** Kategori menu dengan jumlah item dan status ketersediaan.
* **Panel Keranjang Fleksibel:** Pengaturan tipe pesanan (Dine-in / Takeaway), nomor meja, catatan per item, diskon bertingkat (5%, 10%, 15%, 20%), dan kalkulasi PPN 11%.
* **Modal Pembayaran:** Pilihan Tunai (Cash dengan kalkulator kembalian otomatis & tombol cepat uang pas/pecahan), QRIS Dinamis, dan Kartu/Debit EDC.
* **Struk Thermal:** Preview ukuran 58mm / 80mm bergaya printer thermal asli, simulasi suara cetak via Web Audio API, serta unduh struk teks (.txt).

### 3. Inventori & Stok (`/inventory`)
* **Tabel Inventori Lengkap:** Pencarian, filter status stok (Aman, Menipis, Habis), sorting kolom, dan paginasi.
* **StockBadge Dinamis:** Otomatis memperbarui warna dan status (Aman = Hijau, Menipis = Kuning/Amber saat stok <= minStock, Habis = Merah saat stok 0).
* **Penyesuaian Stok Cepat (`StockAdjustmentModal`):** Dukungan barang masuk (+), barang keluar (-), dan opname fisik dengan log alasan perubahan.
* **Katalog Tambah/Edit:** Upload foto / preset gambar produk, pengaturan SKU, barcode, harga beli (HPP), harga jual, dan margin profit.

### 4. Dashboard & Analisis (`/dashboard`)
* **Metric Cards:** Omzet harian, jumlah transaksi, rata-rata keranjang (AOV), produk terlaris, dan peringatan stok.
* **Grafik Penjualan Recharts:** Visualisasi tren penjualan per jam atau 7 hari terakhir (pilihan Area Chart / Bar Chart).
* **5 Transaksi Terkini:** Tabel transaksi dengan tombol pratinjau struk ulang.

### 5. AI Copilot KasirAI (`/ai-assistant`)
* Terhubung langsung dengan database transaksi dan inventori secara real-time.
* **Quick Prompt Chips:**
  - *"Berapa omzet hari ini?"* (Menghitung total omzet, breakdown tunai/QRIS/kartu, rata-rata transaksi)
  - *"Barang apa yang stoknya mau habis?"* (Menganalisa item menipis dan habis serta saran restock)
  - *"Apa menu paling laris?"* (Peringkat produk terlaris dari data transaksi aktual)
  - *"Ide Promo Bundle"* (Rekomendasi paket bundling hemat F&B dengan margin laba)
  - *"Status Shift Kasir"* (Cek kas masuk, modal awal, dan ekspektasi uang laci kasir)
* **Kesiapan Webhook n8n:** Variabel `VITE_N8N_CHATBOT_WEBHOOK_URL` siap dihubungkan ke workflow n8n atau OpenClaw backend eksternal, dengan fallback cerdas ke local AI engine.

---

## 🧪 Panduan Pengujian Prototype

1. **Simulasi Transaksi Kasir:**
   - Buka `/cashier`.
   - Klik salah satu produk (misal: *Kopi Susu Gula Aren* & *Butter Croissant*).
   - Ubah kuantitas di keranjang kanan (+ / -).
   - Klik tombol **Bayar**.
   - Pilih metode pembayaran **QRIS** atau **Tunai**.
   - Klik **Selesaikan & Terbitkan Struk**.
   - Struk thermal 58mm/80mm akan muncul; klik **Cetak Struk** (efek suara & dialog cetak muncul).
2. **Simulasi Manajemen Stok:**
   - Buka menu **Inventori & Stok** (`/inventory`).
   - Cari produk (misal: *Matcha Cream Latte* atau *Dimsum Mentai*).
   - Klik tombol **Stok** pada baris produk.
   - Tambahkan kuantitas barang masuk atau koreksi stok -> Simpan.
   - Perhatikan badge status berubah secara real-time (dari *Habis*/*Menipis* menjadi *Aman*).
3. **Simulasi AI Assistant:**
   - Buka menu **KasirAI Copilot** (`/ai-assistant`).
   - Klik chip *"Cek Omzet Hari Ini"* atau *"Cek Stok Menipis"*.
   - AI akan memberikan respon analitis mendalam berdasarkan data transaksi dan stok toko terkini!

---

## 🛠️ Cara Menjalankan

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```

3. **Build Production:**
   ```bash
   npm run build
   ```

---

## Deploy ke Vercel

1. Push repository ini ke GitHub.
2. Di Vercel, pilih **Add New Project** lalu import repository GitHub tersebut.
3. Biarkan pengaturan build default Vite, atau gunakan:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Tambahkan environment variable `VITE_N8N_CHATBOT_WEBHOOK_URL` di Project Settings jika fitur AI assistant digunakan.

---

## Upload ke GitHub

Repositori git lokal sudah diinisialisasi dan seluruh kode sudah di-commit. Untuk meng-upload ke repository GitHub Anda:

```bash
# 1. Ubah branch default menjadi main
git branch -M main

# 2. Tambahkan URL repository GitHub Anda
git remote add origin https://github.com/<USERNAME>/<REPOSITORY>.git

# 3. Commit perubahan jika belum dilakukan, lalu push
git add .
git commit -m "Prepare app for Vercel deployment"
git push -u origin main
```
