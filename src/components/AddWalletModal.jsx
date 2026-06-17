import React, { useState } from 'react';
import Modal from './Modal';
import { CreditCard, Banknote, Smartphone, Check } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatNumber } from '../utils/format';

const iconOptions = [
  { name: 'Banknote', icon: Banknote },
  { name: 'CreditCard', icon: CreditCard },
  { name: 'Smartphone', icon: Smartphone },
];

const colorOptions = [
  '#0f172a', // Slate
  '#2563eb', // Blue
  '#16a34a', // Green
  '#dc2626', // Red
  '#9333ea', // Purple
  '#ea580c', // Orange
];

const MAX_LIMIT = 1000000000000; // 1 Triliun

const AddWalletModal = ({ isOpen, onClose }) => {
  const { addWallet } = useFinance();
  const [name, setName] = useState('');
  const [type, setType] = useState('Tunai');
  const [balance, setBalance] = useState('');
  const [iconName, setIconName] = useState('Banknote');
  const [color, setColor] = useState(colorOptions[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !balance) return;

    setIsLoading(true);
    try {
      await addWallet({
        name,
        type,
        balance: parseInt(balance),
        iconName,
        color
      });
      // Reset and close
      setName('');
      setType('Tunai');
      setBalance('');
      setIconName('Banknote');
      setColor(colorOptions[0]);
      onClose();
    } catch (error) {
      console.error("Error adding wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Dompet Baru">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">Nama Dompet</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Dompet Utama, BCA, e-Wallet"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">Jenis</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all appearance-none bg-white"
          >
            <option value="Tunai">Tunai</option>
            <option value="Bank">Bank</option>
            <option value="e-Wallet">e-Wallet</option>
            <option value="Investasi">Investasi</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <label className="text-sm font-semibold text-slate-700">Saldo Awal</label>
            <span className="text-[10px] font-medium text-slate-400">Maks: 1 Triliun</span>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Rp</span>
            <input
              type="text"
              value={formatNumber(balance)}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val && parseInt(val, 10) > MAX_LIMIT) return;
                setBalance(val ? parseInt(val, 10).toString() : '');
              }}
              placeholder="0"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">Pilih Ikon</label>
          <div className="flex gap-4">
            {iconOptions.map((opt) => (
              <button
                key={opt.name}
                type="button"
                onClick={() => setIconName(opt.name)}
                className={`p-3 rounded-xl border-2 transition-all ${iconName === opt.name
                  ? 'border-slate-900 bg-slate-50 text-slate-900'
                  : 'border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
              >
                <opt.icon size={24} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">Pilih Warna</label>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                style={{ backgroundColor: c }}
              >
                {color === c && <Check size={16} className="text-white" />}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full py-4 rounded-2xl text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          style={{ backgroundColor: '#3b82f6' }}
        >
          {isLoading ? 'Menyimpan...' : 'Simpan Dompet'}
        </button>
      </form>
    </Modal>
  );
};

export default AddWalletModal;
