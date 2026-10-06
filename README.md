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

### 5. AI Chatbot KasirAI (`/ai-assistant`)
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

Atau

akses link ini
```https://kasir-ai-orcin.vercel.app/```
