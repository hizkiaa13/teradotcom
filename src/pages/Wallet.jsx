import React, { useState } from 'react';
import Card from '../components/Card';
import { CreditCard, Banknote, Smartphone, Plus, Trash2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import AddWalletModal from '../components/AddWalletModal';

const iconMap = {
  'CreditCard': <CreditCard size={24} />,
  'Banknote': <Banknote size={24} />,
  'Smartphone': <Smartphone size={24} />
};

const Wallet = () => {
  const { wallets, totalBalance, resetData, deleteWallet } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto p-6 pb-20 md:pb-6">
      <header>
        <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-widest text-slate-800">Dompet Saya</h1>
        <p className="text-sm text-textMuted">Kelola semua sumber danamu</p>
      </header>

      <Card style={{ backgroundColor: '#0f172a', color: 'white' }}>
        <div className="text-sm text-textMuted mb-2 text-white/80">Total Saldo Keseluruhan</div>
        <div className="text-2xl font-bold mb-4">Rp {totalBalance.toLocaleString('id-ID')}</div>
        <button
          style={{ backgroundColor: "#0f172a", color: 'white' }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold transition-all 
          duration-200 w-full bg-white text-slate-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={20} /> Tambah Dompet
        </button>
      </Card>

      <section className="flex flex-col gap-4">
        <h2 className="text-h2">Daftar Dompet</h2>
        {wallets.map((wallet) => (
          <Card key={wallet.id} className="flex items-center justify-between p-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-xl text-white"
                style={{ backgroundColor: wallet.color }}
              >
                {iconMap[wallet.iconName] || <Banknote size={24} />}
              </div>
              <div>
                <div className="text-xl font-semibold">{wallet.name}</div>
                <div className="text-sm text-textMuted">{wallet.type}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xl font-semibold">Rp {wallet.balance.toLocaleString('id-ID')}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteWallet(wallet.id);
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Hapus Dompet"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </Card>
        ))}
      </section>

      <section className="flex flex-col gap-4 mt-8 pt-8 border-t border-slate-200">
        <div className="flex flex-col">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Zona Bahaya</h2>
          <p className="text-xs text-slate-400 mb-4">Hapus semua data jika ingin memulai dari awal.</p>
        </div>
        <button
          onClick={resetData}
          className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold transition-all 
          duration-200 w-full bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 active:scale-95"
        >
          Reset Semua Data Transaksi
        </button>
      </section>

      <AddWalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Wallet;
