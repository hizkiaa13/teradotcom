import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Download,
  LockKeyhole,
  Plus,
  ReceiptText,
  Wallet,
} from 'lucide-react';

const stats = [
  { label: 'Saldo aktif', value: 'Rp 12.750.000' },
  { label: 'Pemasukan bulan ini', value: 'Rp 4.250.000' },
  { label: 'Pengeluaran bulan ini', value: 'Rp 1.120.000' },
];

const transactions = [
  { name: 'Gaji Bulanan', wallet: 'Dompet Utama', amount: '+Rp 5.000.000', tone: 'text-emerald-300' },
  { name: 'Belanja Bulanan', wallet: 'BCA', amount: '-Rp 850.000', tone: 'text-rose-300' },
  { name: 'Kopi Sore', wallet: 'Tunai', amount: '-Rp 35.000', tone: 'text-rose-300' },
];

const features = [
  {
    icon: ReceiptText,
    title: 'Catat transaksi cepat',
    desc: 'Pemasukan dan pengeluaran tersimpan rapi berdasarkan tanggal, kategori, dan dompet.',
  },
  {
    icon: Wallet,
    title: 'Kelola banyak dompet',
    desc: 'Pantau kas, rekening, dan e-wallet dalam satu tempat dengan saldo yang selalu terbarui.',
  },
  {
    icon: BarChart3,
    title: 'Pantau laporan',
    desc: 'Ringkasan saldo, pemasukan, pengeluaran, dan tren mingguan tampil jelas untuk dibaca.',
  },
  {
    icon: Download,
    title: 'Ekspor Excel',
    desc: 'Riwayat transaksi bisa diunduh sebagai file spreadsheet untuk laporan atau arsip pribadi.',
  },
];

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-[#12161F] text-white font-sans overflow-x-hidden">
      <section className="relative min-h-[92vh] overflow-hidden border-b border-white/10">
        <img
          src="/tera-logo.jpg"
          alt=""
          className="absolute inset-y-8 right-[-110px] hidden h-[82%] max-h-[680px] w-auto opacity-[0.08] lg:block"
        />

        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,#12161F_0%,#12161F_42%,rgba(157,191,219,0.24)_100%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#12161F] to-transparent" />
        </div>

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3 text-[#9DBFDB] hover:text-white">
            <img src="/tera-logo.jpg" alt="Tera" className="h-11 w-11 rounded-lg object-contain" />
            <span className="text-2xl font-black uppercase tracking-[0.16em] !text-white drop-shadow-[0_2px_12px_rgba(157,191,219,0.55)]">
              Tera
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-bold !text-white hover:!text-[#10b981] active:!text-[#10b981]"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-[#9DBFDB] px-4 py-2 text-sm font-black text-[#12161F] transition hover:bg-white active:scale-95 sm:px-5"
            >
              Daftar
              <ArrowRight size={16} />
            </Link>
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:pb-20 lg:pt-16">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-lg border border-[#9DBFDB]/30 bg-white/5 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#9DBFDB]">
              Earn it. Track it. Never lack it.
            </p>

            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-normal text-[#9DBFDB] sm:text-7xl lg:text-8xl">
              Tera
            </h1>
            <p className="mt-5 max-w-2xl text-2xl font-black leading-tight text-white sm:text-4xl">
              Catat, Pantau, dan Kendalikan Keuangan Anda
            </p>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Bantu pengguna mencatat transaksi harian, melihat saldo setiap dompet, membaca grafik pengeluaran, dan mengekspor laporan keuangan dengan mudah.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#9DBFDB] px-6 py-4 text-base font-black text-[#12161F] transition hover:bg-white active:scale-[0.98]"
              >
                Mulai Sekarang
                <ArrowRight size={19} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg border border-white/35 px-6 py-4 text-base font-bold !text-white transition hover:border-[#9DBFDB] hover:!text-[#10b981] active:!text-[#10b981] active:scale-[0.98]"
              >
                Masuk ke Akun
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-lg border border-white/15 bg-[#18202B]/90 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2 text-[#9DBFDB]">
                  <Wallet size={19} />
                  <span className="text-sm font-black uppercase tracking-[0.18em]">Dashboard</span>
                </div>
                <span className="rounded-lg bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  Aktif
                </span>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs font-bold text-slate-400">{item.label}</p>
                    <p className="mt-2 text-lg font-black text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 p-4 pt-0 lg:grid-cols-[1fr_0.9fr]">
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-sm font-black text-white">Pengeluaran 7 Hari</h2>
                    <BarChart3 size={18} className="text-[#9DBFDB]" />
                  </div>
                  <div className="flex h-44 items-end gap-3">
                    {[42, 58, 36, 74, 49, 88, 64].map((height, index) => (
                      <div key={index} className="flex flex-1 flex-col items-center gap-2">
                        <div
                          className="w-full rounded-t-lg bg-[#9DBFDB]"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-[10px] font-bold text-slate-500">
                          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-black text-white">Transaksi Terbaru</h2>
                    <Plus size={18} className="text-[#9DBFDB]" />
                  </div>
                  <div className="space-y-3">
                    {transactions.map((item) => (
                      <div key={item.name} className="flex items-center justify-between gap-3 rounded-lg bg-[#12161F]/70 p-3">
                        <div>
                          <p className="text-sm font-bold text-white">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.wallet}</p>
                        </div>
                        <p className={`text-sm font-black ${item.tone}`}>{item.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto -mt-6 grid max-w-7xl grid-cols-2 gap-3 px-5 pb-8 sm:px-8 md:grid-cols-4">
          {features.map(({ icon: Icon, title }) => (
            <div key={title} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
              <Icon size={20} className="mb-3 text-[#9DBFDB]" />
              <p className="text-sm font-black text-white">{title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#9DBFDB] px-5 py-16 text-[#12161F] sm:px-8">
        {/* Decorative doodle pattern — same as Login page */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <svg className="absolute inset-0 h-full w-full text-white" opacity="0.12">
            <defs>
              <pattern id="landing-doodle" width="180" height="180" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 15,15 L 35,35 L 15,55 L 35,75" />
                  <circle cx="75" cy="30" r="14" />
                  <path d="M 50,70 L 50,105" />
                  <path d="M 115,15 C 130,35 105,55 120,75" />
                  <path d="M 145,20 L 175,50" />
                  <path d="M 170,80 L 170,40 L 145,40" />
                  <path d="M 10,105 C 30,85 55,85 75,105" />
                  <path d="M 10,80 L 30,80" />
                  <path d="M 90,50 L 100,70" />
                  <path d="M 125,100 L 140,80 L 155,100 L 170,80" />
                  <circle cx="160" cy="130" r="12" />
                  <path d="M 85,95 C 95,110 100,115 115,110" />
                  <path d="M 135,120 L 135,150" />
                  <circle cx="30" cy="145" r="14" />
                  <path d="M 10,170 L 40,170" />
                  <path d="M 65,140 L 105,140" />
                  <path d="M 95,170 L 120,170 L 120,145" />
                  <path d="M 145,170 L 175,140" />
                  <path d="M 175,105 L 175,145" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#landing-doodle)" />
          </svg>
        </div>
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] opacity-70">Fitur utama</p>
            <h2 className="mt-3 max-w-xl text-4xl font-black leading-tight sm:text-5xl">
              Semua yang dibutuhkan untuk memahami arus uang.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, desc }) => (
              <article key={title} className="rounded-lg bg-white p-5 shadow-sm">
                <Icon size={24} className="text-[#12161F]" />
                <h3 className="mt-4 text-xl font-black">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-lg border border-white/10 bg-white/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[#9DBFDB]">
              <LockKeyhole size={19} />
              <span className="text-sm font-black uppercase tracking-[0.18em]">Akun pribadi</span>
            </div>
            <h2 className="text-3xl font-black text-white">Mulai rapikan catatan keuangan hari ini.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
              Daftar akun baru, masukkan dompet pertama, lalu catat transaksi pemasukan dan pengeluaran dari dashboard Tera.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#9DBFDB] px-6 py-4 font-black text-[#12161F] transition hover:bg-white active:scale-[0.98]"
          >
            Buat Akun
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-sm text-slate-400 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold text-[#9DBFDB]">Tera</p>
          <p>© {new Date().getFullYear()} Tera Financial Tracker. Semua hak dilindungi.</p>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
