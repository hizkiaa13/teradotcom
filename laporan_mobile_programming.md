# Laporan Progress Proyek: Mobile Programming
**Nama Aplikasi**: FinKu (Daily Financial Tracker)

---

## 1. Analisis Permasalahan
*   **Kendala Nyata**: Masyarakat, terutama mahasiswa dan pekerja muda, sering mengalami kesulitan dalam melacak pengeluaran harian secara detail. 
*   **Masalah Utama**: Pencatatan manual sering terlupakan, kurangnya visualisasi tren pengeluaran bulanan, dan kesulitan mengelola saldo di beberapa dompet (cash, bank, e-wallet) secara terpusat.
*   **Dampak**: Pengeluaran yang tidak terkontrol dan kesulitan dalam merencanakan tabungan masa depan.

## 2. Analisis Kebutuhan
### A. Kebutuhan Fungsional
*   Sistem dapat mencatat transaksi (pemasukan & pengeluaran) secara *real-time*.
*   Sistem menyediakan dasbor visual (grafik) untuk melihat tren pengeluaran.
*   Sistem mampu mengelola lebih dari satu sumber dana (Multi-Wallet).
*   Sistem dapat mengelompokkan transaksi berdasarkan kategori.
*   Sistem mendukung autentikasi Multi-User (Register & Login) dilengkapi dengan visual loader interaktif.
*   Sistem mampu memisahkan data (Isolasi Data) antar pengguna.
*   Sistem dapat mengekspor data transaksi keuangan terfilter ke file Excel (.xlsx) yang diunduh secara otomatis (auto-download).

### B. Kebutuhan Non-Fungsional
*   **Antarmuka (UI)**: Desain modern, intuitif, dan *mobile-friendly* dengan tema premium.
*   **Responsivitas**: Aplikasi dapat digunakan dengan lancar di layar perangkat *mobile*.
*   **Persistensi**: Data tersimpan dengan aman di cloud database PostgreSQL (Supabase/Neon) untuk mendukung deployment serverless.

## 3. Referensi Desain, Survey, & Observasi
*   **Studi Banding**: Mengambil inspirasi dari aplikasi finansial mobile modern seperti *Jenius* dan *Bank Jago* untuk kemudahan navigasi.
*   **Observasi**: Pengguna mobile lebih menyukai aplikasi yang tidak memerlukan banyak langkah untuk mencatat transaksi (konsep "One-Click Input").
*   **Hasil Survey**: Sebagian besar responden membutuhkan grafik visual yang jelas di layar *smartphone* untuk memahami alokasi dana mereka.

## 4. Timeline (Gantt Chart)
| Tahap | Durasi | Status |
| :--- | :--- | :--- |
| Perencanaan dan Analisis | Minggu 1 | ✅ Selesai |
| Desain Wireframe & UI Mobile | Minggu 2 | ✅ Selesai |
| Pengembangan Backend & Database | Minggu 3 | ✅ Selesai |
| Pengembangan Frontend, Integrasi & Deployment | Minggu 4-7 | ✅ Selesai |
| UI Refinement (Mobile Layout & Animasi) | Minggu 8-12 | 🔄 In Progress |
| Pengujian Mobile & Finalisasi | Minggu 13-16 | ⏳ Belum Mulai |

## 5. Wireframe (Low-Fidelity)
*   **Layout Utama**: Menggunakan konsep *Bottom Navigation Bar* untuk kemudahan navigasi menggunakan satu tangan.
*   **Dasbor**: Penempatan kartu saldo total di bagian atas, diikuti oleh grafik tren, dan daftar riwayat transaksi terbaru yang dapat di-*scroll*.
*   **Alur Penggunaan**: Buka Aplikasi -> Dashboard -> Tekan Tombol `+` (FAB) di tengah layar -> Muncul Modal Input Transaksi -> Simpan.

## 6. Desain Interface (High-Fidelity)
*   **Tema**: *Slate Navy Blue* dengan aksen warna vibran (Biru untuk UI, Hijau untuk Pemasukan, Merah untuk Pengeluaran).
*   **Komponen**: 
    *   **Bottom Navigation**: Terdapat lekukan dinamis (*concave*) di tengah untuk memberikan ruang bagi tombol tambah transaksi (*Floating Action Button*).
    *   **Chart**: Menggunakan *AreaChart* responsif yang ukurannya disesuaikan dengan proporsi layar *mobile*.
    *   **Card**: Efek bayangan lembut (*soft shadow*) dan sudut bulat (`rounded-2xl`).
    *   **Glassmorphism Loading Overlay**: Tampilan pemuatan (*loading indicator*) transparan menggunakan filter blur (`backdrop-blur-md`) dengan aksen warna biru-slate yang lembut untuk memberikan pengalaman transisi premium saat masuk halaman.
    *   **Form Ekspor Laporan**: Layout bersih untuk memilih rentang tanggal transaksi sebelum diekspor menjadi format Excel.

## 7. Hasil Coding (Core Snippets)
Berikut adalah demonstrasi potongan kode inti terkait integrasi API, *state management*, transisi loading, dan ekspor data otomatis:

### A. Integrasi API & State Management
```javascript
// Fungsi mengirim data transaksi ke server/API
const addTransaction = async (transaction) => {
  const response = await fetch(`${API_BASE}/api/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...transaction, userId: user.id }),
  });
  
  const data = await response.json();
  
  // State diperbarui secara real-time pada UI Mobile tanpa reload
  setTransactions(prev => [data.transaction, ...prev]);
};
```

### B. Transisi Glassmorphism Loading (Halaman Login)
```javascript
// State loading diatur menjadi true saat form disubmit, dengan delay 800ms demi kelembutan transisi
const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  try {
    const response = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
      login(data);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 800); // Penundaan sengaja untuk kelancaran visual
    } else {
      setError(data.error || 'Login gagal');
      setIsLoading(false);
    }
  } catch (err) {
    setError('Gagal menghubungi server');
    setIsLoading(false);
  }
};
```

### C. Ekspor dan Auto-Download Excel (exportExcel.js)
```javascript
// Menggunakan pustaka SheetJS (xlsx) untuk membuat file Excel dan memicu unduhan langsung
import * as XLSX from 'xlsx';

export const exportTransactionsToExcel = (transactions, wallets, dateRangeStr) => {
  const walletMap = wallets.reduce((map, w) => {
    map[w.id] = w.name;
    return map;
  }, {});

  // Mengubah data JSON transaksi menjadi baris terstruktur Excel
  const excelData = transactions.map((tx, index) => ({
    'No': index + 1,
    'Tanggal': tx.date,
    'Tipe': tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    'Kategori': tx.category,
    'Dompet': walletMap[tx.walletId] || 'Tidak Diketahui',
    'Jumlah (Rp)': tx.amount,
    'Catatan': tx.note || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  worksheet['!cols'] = [
    { wch: 5 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 30 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Keuangan');

  // Trigger unduh otomatis di browser
  const filename = `Laporan_Keuangan_${dateRangeStr.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(workbook, filename);
};
```

## 8. Rancangan Database (Skema Relasi)
Aplikasi menggunakan database relasional **PostgreSQL** (Supabase). Skema databasenya didasarkan pada hubungan **One-to-Many** (Satu pengguna bisa memiliki banyak dompet, satu dompet bisa memiliki banyak transaksi).

### Relasi Antar Tabel:
1.  **Tabel `users` (Master User)**:
    *   Menyimpan data identitas pengguna (`id`, `nickname`, `email`, `password`).
    *   Menjadi tabel induk utama untuk sistem autentikasi multi-user.

2.  **Tabel `wallets` (Master Wallet)**:
    *   Terhubung ke tabel `users` melalui kolom `userId` (Foreign Key).
    *   Menyimpan identitas sumber dana (misal: "BCA", "Gopay", "Tunai") dan saldo akhir yang otomatis *update* saat ada transaksi.

3.  **Tabel `transactions` (Transaction Data)**:
    *   Terhubung ke tabel `wallets` melalui `walletId` dan `users` melalui `userId`.
    *   Berfungsi mencatat setiap aliran uang (pemasukan/pengeluaran) lengkap dengan `kategori`, `nominal`, dan `tanggal`.

---

## Bahan Presentasi (PPT)
Berikut adalah poin-poin utama yang disesuaikan dengan 8 lingkup laporan untuk slide presentasi (PowerPoint):

*   **Slide 1: Analisis Permasalahan**
    *   Pencatatan manual sering terlupakan dan sulit melacak pengeluaran secara detail.
    *   Pengelolaan multi-wallet (tunai, bank, e-wallet) yang tidak terpusat.
*   **Slide 2: Analisis Kebutuhan**
    *   **Fungsional**: Pencatatan *real-time*, grafik tren, *Multi-Wallet*, *Multi-User* dengan loading transition, serta *auto-download* laporan Excel.
    *   **Non-Fungsional**: UI *mobile-friendly* dengan persistensi data PostgreSQL di Supabase.
*   **Slide 3: Referensi Desain, Survey, & Observasi**
    *   Konsep "One-Click Input" terinspirasi dari aplikasi finansial modern.
    *   Kebutuhan tinggi terhadap visualisasi grafik di layar *smartphone*.
*   **Slide 4: Timeline**
    *   Tahap Perencanaan hingga Backend (Selesai).
    *   Tahap Integrasi API & Frontend (Sedang Berjalan).
*   **Slide 5: Wireframe**
    *   Konsep *Bottom Navigation Bar* untuk kemudahan satu tangan.
    *   Alur cepat: Dashboard -> Tombol `+` (FAB) -> Input Transaksi.
*   **Slide 6: Desain Interface**
    *   Tema *Slate Navy Blue* yang premium dengan lekukan dinamis (*concave*) pada navigasi.
    *   Kartu bersudut bulat (`rounded-2xl`) dan grafik area responsif.
    *   Glassmorphism Loading Overlay saat autentikasi & Form Ekspor Laporan Excel.
*   **Slide 7: Hasil Coding**
    *   Integrasi API transaksi *real-time* ke cloud database.
    *   Efek tunggu (Loading Transition) di halaman login dengan penundaan visual 800ms.
    *   Utilitas pengunduhan otomatis (auto-download) dokumen Excel `.xlsx` menggunakan SheetJS.
*   **Slide 8: Rancangan Database**
    *   Skema relasional **One-to-Many**.
    *   Tabel terpusat: `users` (Master), `wallets` (Master), dan `transactions` (Data).
 
### Tambahan (Ringkasan Profil Proyek)
*   **Slide 9: Judul & Identitas**
    *   **Nama Aplikasi**: FinKu (Daily Financial Tracker)
    *   **Fokus**: Aplikasi pelacakan keuangan harian berbasis *mobile*.
*   **Slide 10: Latar Belakang Masalah**
    *   Kesulitan melacak pengeluaran secara manual dan kurangnya visualisasi data.
    *   Pengelolaan multi-wallet (cash, e-wallet, bank) yang tidak terpusat.
*   **Slide 11: Solusi (Fitur Utama)**
    *   Pencatatan *real-time* ("One-Click Input").
    *   Visualisasi tren menggunakan grafik responsif.
    *   Dukungan *Multi-Wallet* dan autentikasi *Multi-User*.
    *   Ekspor data & auto-download laporan keuangan format Excel (.xlsx).
*   **Slide 12: Desain & Teknologi**
    *   **UI/UX**: Bottom Navigation Bar, *Slate Navy Blue* Theme, desain *mobile-friendly*.
    *   **Teknologi Utama**: React, Vercel Serverless Functions, PostgreSQL (Supabase), SheetJS (XLSX).
*   **Slide 13: Progress Terkini**
    *   **Selesai**: Perencanaan, Desain UI, Database Cloud, Backend Serverless, Integrasi Frontend, Fitur Pemuatan Login, Ekspor Excel Auto-Download, dan Deployment Vercel.
    *   **Berjalan**: UI Refinement & Dokumentasi Akhir.
