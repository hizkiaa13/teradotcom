import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE } from '../context/FinanceContext';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Kata sandi tidak cocok');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: formData.nickname,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Pendaftaran gagal');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(`Gagal menghubungi server (${API_BASE || window.location.origin})`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#12161F] text-center font-sans overflow-x-hidden">
      {/* Top Section - Large Logo */}
      <div className="flex-1 flex items-center justify-center pt-10 pb-6 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
        <h1 className="text-[100px] sm:text-[150px] md:text-[200px] font-display uppercase font-black text-[#9DBFDB] leading-none tracking-tighter">
          Tera
        </h1>
      </div>

      {/* Bottom Section - Register Form Podium */}
      <div className="bg-[#9DBFDB] rounded-t-[80px] md:rounded-t-[120px] pt-12 pb-16 px-6 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-3xl font-black text-[#12161F] mb-1">Daftar Akun</h2>
        <p className="text-[#12161F]/60 font-medium mb-6">Silakan isi data di bawah untuk membuat akun baru</p>
        
        {error && <div className="mb-4 text-red-600 font-bold">{error}</div>}

        <form onSubmit={handleRegister} className="w-full max-w-md flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-left text-lg font-bold text-[#12161F] ml-4">Nama Panggilan</label>
            <input 
              type="text" 
              required 
              placeholder="Contoh: Budi"
              value={formData.nickname}
              onChange={(e) => setFormData({...formData, nickname: e.target.value})}
              className="w-full bg-white border-none py-4 px-6 rounded-3xl text-slate-800 text-lg shadow-sm focus:ring-2 focus:ring-[#12161F]/20 outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-left text-lg font-bold text-[#12161F] ml-4">Email</label>
            <input 
              type="email" 
              required 
              placeholder="nama@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-white border-none py-4 px-6 rounded-3xl text-slate-800 text-lg shadow-sm focus:ring-2 focus:ring-[#12161F]/20 outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-left text-lg font-bold text-[#12161F] ml-4">Kata Sandi</label>
            <div className="relative w-full">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-white border-none py-4 pl-6 pr-14 rounded-3xl text-slate-800 text-lg shadow-sm focus:ring-2 focus:ring-[#12161F]/20 outline-none transition-all placeholder:text-slate-300"
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

          <div className="flex flex-col gap-2">
            <label className="text-left text-lg font-bold text-[#12161F] ml-4">Konfirmasi Kata Sandi</label>
            <div className="relative w-full">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                required 
                placeholder="Ulangi kata sandi"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full bg-white border-none py-4 pl-6 pr-14 rounded-3xl text-slate-800 text-lg shadow-sm focus:ring-2 focus:ring-[#12161F]/20 outline-none transition-all placeholder:text-slate-300"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 !bg-[#12161F] text-white py-5 px-6 rounded-3xl font-bold text-2xl shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            Daftar Sekarang
          </button>
        </form>

        <div className="mt-8 text-[#12161F]/80">
          <span>Sudah Punya Akun? </span>
          <Link to="/login" className="font-black text-[#12161F] hover:underline">Masuk Di Sini</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
