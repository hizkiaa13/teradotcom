import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { ArrowLeft, Save, Calendar, Tag, CreditCard, Pencil } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatNumber } from '../utils/format';

const MAX_LIMIT = 1000000000000; // 1 Triliun

const InputTransaction = () => {
  const navigate = useNavigate();
  const { addTransaction, wallets } = useFinance();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-select first wallet if none selected and wallets are available
  React.useEffect(() => {
    if (!walletId && wallets.length > 0) {
      setWalletId(wallets[0].id);
    }
  }, [wallets, walletId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category || !date || !walletId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await addTransaction({
        type,
        amount: parseFloat(amount),
        category,
        date,
        note,
        walletId: parseInt(walletId)
      });

      // If we made addTransaction return a boolean or something, we could check it here.
      // For now, let's assume it works if it doesn't throw.
      navigate('/dashboard');
    } catch (err) {
      console.error("Submission failed:", err);
      setError("Gagal menyimpan transaksi. Pastikan server berjalan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full p-6 pb-20 md:pb-6">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-200 transition-colors bg-white shadow-sm">
          <ArrowLeft size={24} className="text-slate-700" />
        </button>
        <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-widest text-slate-800">Tambah Transaksi</h1>
      </header>

      <Card className="p-0 overflow-hidden border-none shadow-xl">
        <div className="flex p-2 bg-slate-100 rounded-t-3xl">
          <button
            className={`flex-1 py-4 text-center rounded-2xl font-bold transition-all ${type === 'expense' ? 'bg-white shadow-md text-danger scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setType('expense')}
          >
            Pengeluaran
          </button>
          <button
            className={`flex-1 py-4 text-center rounded-2xl font-bold transition-all ${type === 'income' ? 'bg-white shadow-md text-success scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setType('income')}
          >
            Pemasukan
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8 bg-white">
          {error && (
            <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Nominal (Rp)</label>
              <span className="text-[10px] font-medium text-slate-400">Maks: 1 Triliun</span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400"></span>
              <input
                type="text"
                placeholder="0"
                required
                className="w-full pl-20 py-6 text-5xl font-black text-slate-800 border-none focus:ring-0 placeholder-slate-300"
                value={formatNumber(amount)}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val && parseInt(val, 10) > MAX_LIMIT) return;
                  setAmount(val ? parseInt(val, 10).toString() : '');
                }}
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <Tag size={16} /> Kategori
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all appearance-none bg-slate-50 font-medium"
              >
                <option value="" disabled>Pilih Kategori</option>
                {type === 'expense' ? (
                  <>
                    <option value="Makan">Makan & Minum</option>
                    <option value="Transportasi">Transportasi</option>
                    <option value="Hiburan">Hiburan</option>
                    <option value="Belanja">Belanja</option>
                    <option value="Tagihan">Tagihan</option>
                  </>
                ) : (
                  <>
                    <option value="Gaji">Gaji</option>
                    <option value="Bonus">Bonus</option>
                    <option value="Investasi">Investasi</option>
                  </>
                )}
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <CreditCard size={16} /> Dompet
              </label>
              <select
                required
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all appearance-none bg-slate-50 font-medium"
              >
                <option value="" disabled>Pilih Dompet</option>
                {wallets && wallets.length > 0 ? (
                  wallets.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} (Rp {w.balance.toLocaleString('id-ID')})
                    </option>
                  ))
                ) : (
                  <option disabled>Tidak ada dompet tersedia</option>
                )}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <Calendar size={16} /> Tanggal
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all bg-slate-50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <Pencil size={16} /> Catatan
              </label>
              <input
                type="text"
                placeholder="Makan siang di warteg..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all bg-slate-50"
              />
            </div>
          </div>

          <button
            style={{ backgroundColor: "#0f172a" }}
            type="submit"
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 py-5 rounded-2xl font-bold text-white transition-all shadow-lg hover:shadow-xl active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed ${type === 'expense' ? 'bg-slate-900 hover:bg-slate-800' : 'bg-success hover:opacity-90'
              }`}
          >
            <Save size={20} />
            {isLoading ? 'Menyimpan...' : 'Simpan Transaksi'}
          </button>
        </form>

      </Card>
    </div>
  );
};

export default InputTransaction;
