import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFinance, API_BASE } from '../context/FinanceContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useFinance();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        login(data);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login gagal');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(`Gagal menghubungi server (${API_BASE || window.location.origin})`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#12161F] text-center font-sans overflow-x-hidden">
      {/* Top Section - Large Logo */}
      <div className="flex-1 flex items-center justify-center pt-20 pb-10">
        <h1 className="text-[120px] sm:text-[200px] md:text-[250px] font-display uppercase font-black text-[#9DBFDB] leading-none tracking-tighter">
          Tera
        </h1>
      </div>

      {/* Bottom Section - Login Form Podium */}
      <div className="bg-[#9DBFDB] rounded-t-[80px] md:rounded-t-[120px] pt-16 pb-20 px-6 flex flex-col items-center">
        <h2 className="text-3xl font-black text-[#12161F] mb-6">Masuk</h2>
        
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
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-none py-4 px-6 rounded-3xl text-slate-800 text-lg shadow-sm focus:ring-2 focus:ring-[#12161F]/20 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="mt-4 !bg-[#12161F] text-white py-5 px-6 rounded-3xl font-bold text-2xl shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            Masuk
          </button>
        </form>

        <div className="mt-10 text-[#12161F]/80">
          <span>Belum Punya Akun? </span>
          <Link to="/register" className="font-black text-[#12161F] hover:underline">Daftar Akun Baru</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
