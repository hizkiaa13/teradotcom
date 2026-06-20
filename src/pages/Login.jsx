import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFinance, API_BASE } from '../context/FinanceContext';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useFinance();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


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
        // Memberikan sedikit delay agar transisi animasi loading terlihat smooth
        setTimeout(() => {
          setIsLoading(false);
          navigate('/dashboard');
        }, 800);
      } else {
        setError(data.error || 'Login gagal');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(`Gagal menghubungi server (${API_BASE || window.location.origin})`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#12161F] text-center font-sans overflow-x-hidden">
      <div className="relative flex min-h-[44vh] flex-1 flex-col items-center justify-center px-6 pb-8 pt-12 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
        <Link
          to="/"
          className="absolute left-5 top-5 z-20 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#9DBFDB]/25 bg-white/[0.04] text-sm font-black !text-white backdrop-blur transition hover:border-[#9DBFDB] hover:!text-[#9DBFDB] sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2"
        >
          <ArrowLeft size={17} />
          <span className="hidden sm:inline">Kembali ke Beranda</span>
        </Link>
        <img
          src="/tera-logo.jpg"
          alt=""
          className="absolute right-[-70px] top-10 hidden h-64 w-64 rounded-[36px] object-contain opacity-[0.06] sm:block"
        />
        <div className="relative z-10 mb-5 flex items-center gap-3 rounded-lg border border-[#9DBFDB]/20 bg-white/[0.04] px-4 py-3">
          <img src="/tera-logo.jpg" alt="Tera" className="h-10 w-10 rounded-lg object-contain" />
          <span className="text-sm font-black uppercase tracking-[0.22em] text-[#9DBFDB]">Financial Tracker</span>
        </div>
        <h1 className="relative z-10 text-[112px] sm:text-[180px] md:text-[230px] font-display uppercase font-black text-[#9DBFDB] leading-none tracking-tighter drop-shadow-[0_10px_40px_rgba(157,191,219,0.18)]">
          Tera
        </h1>
        <p className="relative z-10 mt-3 max-w-4xl text-[16px] sm:text-[28px] md:text-[34px] font-black text-[#9DBFDB]/80 tracking-[0.18em] uppercase">
          EARN IT. TRACK IT. NEVER LACK IT.
        </p>
      </div>

      <div className="relative overflow-hidden bg-[#9DBFDB] rounded-t-[48px] md:rounded-t-[86px] px-5 pb-12 pt-10 sm:px-6 md:pb-16 md:pt-12 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <svg className="absolute inset-0 h-full w-full text-white" opacity="0.12">
            <defs>
              <pattern id="auth-doodle-login" width="180" height="180" patternUnits="userSpaceOnUse">
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
            <rect width="100%" height="100%" fill="url(#auth-doodle-login)" />
          </svg>
        </div>
        <div className="absolute left-1/2 top-5 h-1.5 w-20 -translate-x-1/2 rounded-full bg-[#12161F]/25" />
        <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="hidden text-left md:block">
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg bg-[#12161F]/10 px-4 py-3 text-[#12161F]">
              <ShieldCheck size={20} />
              <span className="text-sm font-black uppercase tracking-[0.18em]">Akun pribadi</span>
            </div>
            <h2 className="max-w-md text-5xl font-black leading-tight text-[#12161F]">
              Lanjutkan catatan keuanganmu.
            </h2>
            <p className="mt-4 max-w-md text-base font-semibold leading-8 text-[#12161F]/65">
              Masuk untuk melihat saldo dompet, transaksi terbaru, dan laporan pengeluaran dari dashboard Tera.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-5 text-left shadow-[0_24px_70px_rgba(18,22,31,0.22)] sm:p-7">
            <div className="mb-6 text-center md:text-left">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#9DBFDB]">Selamat datang</p>
              <h2 className="mt-2 text-3xl font-black text-[#12161F]">Masuk ke Akun</h2>
            </div>

            {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-600">{error}</div>}

            <form onSubmit={handleLogin} className="flex w-full flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-black uppercase tracking-[0.12em] text-[#12161F]/70">Email</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-5 text-base font-semibold text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-300 focus:border-[#12161F] focus:bg-white focus:ring-4 focus:ring-[#9DBFDB]/40"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-black uppercase tracking-[0.12em] text-[#12161F]/70">Kata Sandi</label>
                <div className="relative w-full">
                  <LockKeyhole size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-14 text-base font-semibold text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-300 focus:border-[#12161F] focus:bg-white focus:ring-4 focus:ring-[#9DBFDB]/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
                </div>
            </div>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#12161F] px-6 py-4 text-lg font-black text-white shadow-[0_16px_32px_rgba(18,22,31,0.22)] transition-all hover:bg-slate-800 active:scale-[0.98]"
              >
                Masuk
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-6 text-center text-sm font-semibold text-[#12161F]/65">
              <span>Belum punya akun? </span>
              <Link to="/register" className="font-black !text-[#12161F] hover:underline">Daftar Akun Baru</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Glassmorphism Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12161F]/60 backdrop-blur-md transition-all duration-300">
          <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/5 border border-white/10 shadow-2xl animate-fade-in-up">
            <div className="w-12 h-12 border-4 border-[#9DBFDB]/20 border-t-[#9DBFDB] rounded-full animate-spin"></div>
            <p className="text-[#9DBFDB] text-sm font-semibold uppercase tracking-widest mt-2 animate-pulse">Memuat...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
