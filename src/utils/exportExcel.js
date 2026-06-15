import * as XLSX from 'xlsx';

/**
 * Mengunduh daftar transaksi ke file Excel (.xlsx)
 * @param {Array} transactions - Daftar transaksi yang sudah difilter
 * @param {Array} wallets - Daftar dompet untuk memetakan nama dompet
 * @param {string} dateRangeStr - Informasi rentang tanggal untuk nama file & header
 */
export const exportTransactionsToExcel = (transactions, wallets, dateRangeStr) => {
  // Peta ID Dompet ke Nama Dompet
  const walletMap = wallets.reduce((map, w) => {
    map[w.id] = w.name;
    return map;
  }, {});

  // Mengubah data transaksi menjadi baris-baris Excel
  const excelData = transactions.map((tx, index) => ({
    'No': index + 1,
    'Tanggal': tx.date,
    'Tipe': tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    'Kategori': tx.category,
    'Dompet': walletMap[tx.walletId] || 'Tidak Diketahui',
    'Jumlah (Rp)': tx.amount,
    'Catatan': tx.note || '-'
  }));

  // Buat worksheet dari JSON
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Atur lebar kolom agar rapi dan tidak terpotong
  const colWidths = [
    { wch: 5 },   // No
    { wch: 15 },  // Tanggal
    { wch: 15 },  // Tipe
    { wch: 15 },  // Kategori
    { wch: 15 },  // Dompet
    { wch: 18 },  // Jumlah (Rp)
    { wch: 30 }   // Catatan
  ];
  worksheet['!cols'] = colWidths;

  // Buat workbook dan lampirkan worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Keuangan');

  // Nama file default
  const filename = `Laporan_Keuangan_${dateRangeStr.replace(/\s+/g, '_')}.xlsx`;

  // Unduh file
  XLSX.writeFile(workbook, filename);
};
