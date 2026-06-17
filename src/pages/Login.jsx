import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFinance, API_BASE } from '../context/FinanceContext';
import { Eye, EyeOff } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen bg-[#12161F] text-center font-sans overflow-x-hidden">
      {/* Top Section - Large Logo */}
      <div className="flex-1 flex flex-col items-center justify-center pt-12 pb-6 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
        <h1 className="text-[120px] sm:text-[200px] md:text-[250px] font-display uppercase font-black text-[#9DBFDB] leading-none tracking-tighter">
          Tera
        </h1>
        <p className="text-[18px] sm:text-[30px] md:text-[36px] font-bold text-[#9DBFDB]/70 tracking-[0.2em] uppercase mt-2 sm:mt-3 md:mt-4">
          EARN IT. TRACK IT. NEVER LACK IT.
        </p>
      </div>

      {/* Bottom Section - Login Form Podium */}
      <div className="bg-[#9DBFDB] rounded-t-[80px] md:rounded-t-[120px] pt-16 pb-20 px-6 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-3xl font-black text-[#12161F] mb-6">Log In</h2>

        {error && <div className="mb-4 text-red-600 font-bold">{error}</div>}

        <form onSubmit={handleLogin} className="w-full max-w-md flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-left text-lg font-bold text-[#12161F] ml-4">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-none py-4 px-6 rounded-3xl text-slate-800 text-lg shadow-sm focus:ring-2 focus:ring-[#12161F]/20 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-left text-lg font-bold text-[#12161F] ml-4">Kata Sandi</label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border-none py-4 pl-6 pr-14 rounded-3xl text-slate-800 text-lg shadow-sm focus:ring-2 focus:ring-[#12161F]/20 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{ backgroundColor: '#12161F' }}
            className="mt-4 text-white py-5 px-6 rounded-3xl font-bold text-2xl shadow-lg hover:opacity-90 active:scale-95 transition-all w-full"
          >
            Masuk
          </button>
        </form>

        <div className="mt-10 text-[#12161F]/80">
          <span>Belum Punya Akun? </span>
          <Link to="/register" className="font-black text-[#12161F] hover:underline">Daftar Akun Baru</Link>
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
