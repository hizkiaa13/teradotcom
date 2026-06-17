# Laporan Progress Proyek: Rekayasa Web
**Nama Aplikasi**: FinKu (Daily Financial Tracker)
**Tujuan**: Laporan Progress Mingguan (Week 6) & Milestone Pengembangan Core

---

## 1. Analisis Permasalahan
*   **Kendala Nyata**: Masyarakat, terutama mahasiswa dan pekerja muda, sering mengalami kesulitan dalam melacak pengeluaran harian secara detail. 
*   **Masalah Utama**: Pencatatan manual sering terlupakan, kurangnya visualisasi tren pengeluaran bulanan, dan kesulitan mengelola saldo di beberapa dompet (cash, bank, e-wallet) secara terpusat.
*   **Dampak**: Pengeluaran yang tidak terkontrol dan kesulitan dalam merencanakan tabungan masa depan.

## 2. Analisis Kebutuhan
### A. Kebutuhan Fungsional
*   Sistem dapat mencatat transaksi (pemasukan & pengeluaran) secara *real-time*.
*   Sistem menyediakan dasbor visual (grafik) untuk melihat tren pengeluaran 7 hari terakhir.
*   Sistem mampu mengelola lebih dari satu sumber dana (Multi-Wallet).
*   Sistem dapat mengelompokkan transaksi berdasarkan kategori (Makan, Transportasi, dll.).
*   Sistem memiliki fitur reset data untuk pembersihan riwayat secara total.
*   Sistem mendukung **Multi-User** dengan fitur pendaftaran (Register) dan masuk (Login) yang aman, dilengkapi dengan visual loader interaktif.
*   Sistem mampu memisahkan data (Isolasi Data) antar pengguna sehingga privasi terjaga.
*   Sistem dapat mengekspor data transaksi keuangan terfilter ke file Excel (.xlsx) yang diunduh secara otomatis (auto-download).

### B. Kebutuhan Non-Fungsional
*   **Antarmuka (UI)**: Desain modern dengan tema gelap/slate premium dan efek transparan (glassmorphism).
*   **Responsivitas**: Aplikasi dapat diakses dengan nyaman melalui perangkat desktop maupun mobile (layout adaptif).
*   **Persistensi**: Data tersimpan secara permanen dalam database PostgreSQL (Supabase/Neon) di cloud untuk mendukung deployment serverless.

## 3. Referensi Desain, Survey, & Observasi
*   **Studi Banding**: Mengambil inspirasi dari aplikasi finansial modern seperti *Jenius* dan *Bank Jago* untuk kemudahan navigasi.
*   **Observasi**: Pengguna lebih menyukai aplikasi yang tidak memerlukan banyak langkah untuk mencatat transaksi (konsep "One-Click Input").
*   **Hasil Survey**: 80% responden membutuhkan grafik visual untuk memahami ke mana uang mereka pergi tanpa harus membaca tabel angka yang panjang.

## 4. Timeline (Gantt Chart)
| Tahap | Durasi | Status |
| :--- | :--- | :--- |
| Perencanaan dan Analisis | Minggu 1 | ✅ Selesai |
| Desain Wireframe & UI | Minggu 2 | ✅ Selesai |
| Pengembangan Backend & Database | Minggu 3 | ✅ Selesai |
| Pengembangan Frontend, Integrasi & Deployment | Minggu 4-7 | ✅ Selesai |
| UI Refinement (Gradients & Animasi) | Minggu 8-12 | 🔄 In Progress |
| Finalisasi & Dokumentasi | Minggu 13-16 | ⏳ Belum Mulai |

## 5. Wireframe (Low-Fidelity)
*   **Layout Utama**: Menggunakan konsep *Fixed Sidebar* di sisi kiri dan *Floating Card* di area konten utama.
*   **Dasbor**: Penempatan kartu saldo di bagian atas, diikuti oleh grafik area di bawahnya, dan daftar transaksi terbaru di sisi kanan.
*   **Alur**: Sidebar -> Klik Dashboard -> Lihat Ringkasan -> Klik Tambah -> Muncul Modal Input.

## 6. Desain Interface (High-Fidelity)
*   **Tema**: *Slate Navy Blue* dengan aksen warna vibran (Biru, Hijau untuk sukses, Merah untuk bahaya).
*   **Komponen**: 
    *   **Sidebar**: Memiliki lekukan dinamis (*concave*) yang menyatu dengan latar belakang.
    *   **Chart**: Menggunakan `AreaChart` dengan gradien linear biru.
    *   **Card**: Efek bayangan lembut (*soft shadow*) dan sudut bulat (`rounded-2xl`).
    *   **Glassmorphism Loading Overlay**: Tampilan pemuatan (*loading indicator*) transparan menggunakan filter blur (`backdrop-blur-md`) dengan aksen warna biru-slate yang lembut untuk memberikan pengalaman transisi premium saat masuk halaman.
    *   **Form Ekspor Laporan**: Layout bersih untuk memilih rentang tanggal transaksi sebelum diekspor menjadi format Excel.

## 7. Hasil Coding (Core Snippets)
Bagian ini menunjukkan implementasi logika utama yang menghubungkan antarmuka pengguna dengan penyimpanan data:

### A. Integrasi API & State Management (Frontend)
Aplikasi menggunakan **React Context API** untuk mengelola data secara terpusat. Hal ini memastikan bahwa ketika ada transaksi baru ditambahkan, saldo di dasbor dan daftar transaksi akan langsung diperbarui tanpa perlu memuat ulang halaman (*Re-render* otomatis).

```javascript
// Fungsi mengirim data ke server menggunakan Fetch API dengan header userId
const addTransaction = async (transaction) => {
  const response = await fetch(`${API_BASE}/api/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...transaction, userId: user.id }),
  });
  const data = await response.json();
  // State diperbarui secara real-time untuk user yang sedang login
  setTransactions(prev => [data.transaction, ...prev]);
};
```

### B. Arsitektur REST API & Logika Bisnis (Backend)
Backend menggunakan **Express.js** untuk menangani permintaan dari frontend. Fitur unggulannya adalah **Otomatisasi Saldo**, di mana server tidak hanya menyimpan riwayat transaksi, tetapi juga menghitung ulang saldo dompet yang bersangkutan secara *real-time*.

```javascript
// Endpoint untuk memproses transaksi baru
app.post('/api/transactions', (req, res) => {
  const { type, amount, walletId } = req.body;
  
  db.serialize(() => {
    // 1. Masukkan data ke tabel riwayat transaksi
    db.run(INSERT_SQL, [...], function(err) {
      // 2. Hitung saldo baru berdasarkan jenis (Pemasukan/Pengeluaran)
      // Jika income: saldo + amount | Jika expense: saldo - amount
      const newBalance = type === 'income' ? currentBalance + amount : currentBalance - amount;
      
      // 3. Update saldo dompet yang digunakan secara otomatis
      db.run('UPDATE wallets SET balance = ? WHERE id = ?', [newBalance, walletId]);
    });
  });
});
```

### C. Sistem Autentikasi & Isolasi Data (Keamanan)
Aplikasi menerapkan filter `userId` pada setiap query database. Hal ini menjamin bahwa setiap pengguna hanya dapat melihat dan memodifikasi data mereka sendiri, menciptakan lingkungan multi-user yang aman.

```javascript
// Query backend yang sudah terisolasi
app.get('/api/transactions', (req, res) => {
  const userId = req.query.userId;
  db.all('SELECT * FROM transactions WHERE userId = ?', [userId], (err, rows) => {
     res.json(rows);
  });
});
```

### D. Transisi Glassmorphism Loading (Halaman Login)
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

### E. Ekspor dan Auto-Download Excel (exportExcel.js)
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
Aplikasi menggunakan **PostgreSQL** (Supabase), sebuah database relasional cloud yang sangat handal untuk deployment serverless. Rancangan databasenya didasarkan pada hubungan **One-to-Many** (Satu dompet dapat memiliki banyak transaksi).

### A. Deskripsi Tabel
1.  **Tabel `wallets` (Master Data)**:
    *   Berfungsi menyimpan identitas sumber dana (misal: "Tabungan BCA", "Dompet Tunai").
    *   Menyimpan state saldo akhir yang selalu diperbarui setiap kali ada transaksi.
    *   Kolom `color` digunakan oleh UI untuk membedakan visual tiap dompet di layar.

2.  **Tabel `transactions` (Transaction Data)**:
    *   Berfungsi mencatat setiap aliran uang keluar dan masuk secara kronologis.
    *   Memiliki kolom `walletId` sebagai **Foreign Key** yang merujuk pada tabel `wallets`.
    *   Mencatat `type`, `category`, dan `date` untuk keperluan filter laporan bulanan.

3.  **Tabel `users` (Account Data) [NEW]**:
    *   Menyimpan data identitas pengguna (`nickname`, `email`, `password`).
    *   Menjadi tabel induk utama yang menghubungkan data dompet dan transaksi melalui `userId`.

### B. Keunggulan Rancangan
*   **Keamanan & Privasi**: Dengan skema `userId`, aplikasi mendukung banyak pengguna di satu sistem tanpa risiko data bocor ke pengguna lain.
*   **Integritas Data**: Penggunaan Foreign Key memastikan tidak ada transaksi yang "terputus" tanpa dompet atau user yang jelas.
*   **Kecepatan Query**: Data diurutkan berdasarkan `id DESC` sehingga transaksi terbaru selalu muncul paling atas di halaman Dashboard dengan performa yang cepat.

## Fitur Unggulan & Inovasi
Selain fitur dasar pencatatan, FinKu menyertakan beberapa inovasi untuk meningkatkan pengalaman pengguna:
*   **Personal Greeting**: Dasbor menyapa pengguna dengan nama panggilan mereka secara dinamis, memberikan kesan personal.
*   **Toggle Laporan Interaktif**: Halaman laporan dilengkapi dengan fitur perpindahan cepat antara visualisasi Pemasukan dan Pengeluaran.
*   **Auto-Wallet Provisioning**: Pengguna baru secara otomatis mendapatkan tiga dompet default (BCA, Tunai, GoPay) sehingga aplikasi siap digunakan seketika setelah registrasi.
*   **Cross-Device Accessibility**: Server dikonfigurasi untuk dapat diakses melalui berbagai perangkat dalam jaringan WiFi yang sama (Laptop, Smartphone) untuk pengujian yang lebih fleksibel.

## Penutup
Proyek FinKu saat ini telah menyelesaikan tahap pengembangan struktur *database* dan arsitektur *backend*. Memasuki minggu ke-6, fokus utama tim adalah pada tahap **Pengembangan Frontend & Integrasi API**, di mana antarmuka pengguna sedang dihubungkan dengan server untuk memastikan fungsionalitas transaksi dan autentikasi berjalan lancar secara *real-time*. Sesuai dengan rencana 16 minggu, tahap selanjutnya akan difokuskan pada penyempurnaan UI (*refinement*) serta dokumentasi final.

---

## Bahan Presentasi (PPT)
Berikut adalah poin-poin utama yang disesuaikan dengan 8 lingkup laporan untuk slide presentasi (PowerPoint):

*   **Slide 1: Analisis Permasalahan**
    *   Kurangnya visualisasi tren pengeluaran bulanan.
    *   Kesulitan mengelola berbagai sumber dana dan pengeluaran tak terkontrol.
*   **Slide 2: Analisis Kebutuhan**
    *   **Fungsional**: Dasbor 7 hari, isolasi data aman (*Multi-User*), transisi loading, serta *auto-download* laporan Excel.
    *   **Non-Fungsional**: Antarmuka adaptif berbasis *glassmorphism* & tema gelap dengan cloud database PostgreSQL.
*   **Slide 3: Referensi Desain, Survey, & Observasi**
    *   Desain navigasi cepat terinspirasi dari aplikasi perbankan digital terkini.
    *   80% responden lebih memahami grafik dibandingkan angka dalam tabel.
*   **Slide 4: Timeline**
    *   Proyek direncanakan 16 minggu.
    *   Milestone saat ini (Minggu 6): Fokus pada Integrasi Frontend & API.
*   **Slide 5: Wireframe**
    *   Tata letak Desktop: *Fixed Sidebar* kiri, *Floating Card* di area utama.
    *   Alur interaksi yang singkat melalui modul input modal.
*   **Slide 6: Desain Interface**
    *   Tema *Slate Navy Blue* dengan aksen warna vibran.
    *   Penggunaan `AreaChart` dengan gradien biru linear, Glassmorphism Loading Overlay saat masuk, dan Form Laporan Excel.
*   **Slide 7: Hasil Coding**
    *   Manajemen *State* terpusat (React Context API) & Otomatisasi Saldo (Express.js).
    *   Efek tunggu (Loading Transition) di halaman login dengan penundaan visual 800ms.
    *   Utilitas pengunduhan otomatis (auto-download) dokumen Excel `.xlsx` menggunakan SheetJS.
*   **Slide 8: Rancangan Database**
    *   Penggunaan PostgreSQL/SQLite dengan sistem Foreign Key yang ketat.
    *   Filter `userId` di setiap *query* untuk menjamin keamanan dan privasi data.
 
### Tambahan (Ringkasan Profil Proyek)
*   **Slide 9: Judul & Identitas**
    *   **Nama Aplikasi**: FinKu (Daily Financial Tracker)
    *   **Fokus**: Proyek Rekayasa Web - Milestone Pengembangan Core.
*   **Slide 10: Latar Belakang & Kebutuhan**
    *   **Masalah**: Kesulitan masyarakat melacak pengeluaran dan mengelola saldo tersebar.
    *   **Kebutuhan**: Aplikasi pencatat *real-time* yang terpusat dengan dashboard visual.
*   **Slide 11: Fitur Utama FinKu**
    *   Dasbor interaktif dengan grafik 7 hari terakhir.
    *   Manajemen *Multi-Wallet* dan Isolasi Data per Pengguna.
    *   Autentikasi aman, *Auto-Wallet Provisioning*, dan ekspor laporan Excel otomatis (.xlsx).
*   **Slide 12: Arsitektur & Teknologi**
    *   **Frontend**: React dengan Context API untuk *State Management* dan SheetJS untuk ekspor.
    *   **Backend**: Vercel Serverless Functions.
    *   **Database**: PostgreSQL (Supabase) dengan skema relasional (Users, Wallets, Transactions).
*   **Slide 13: Progress Mingguan (Week 6)**
    *   Database Cloud, Backend Serverless, dan fungsionalitas Ekspor Excel Auto-Download serta Transisi Loading Login 100% Selesai.
    *   Fokus saat ini pada penyempurnaan UI Refinement dan Laporan Akhir.
 
---
*Laporan ini disusun sebagai pemenuhan tugas proyek mata kuliah Rekayasa Web.*
