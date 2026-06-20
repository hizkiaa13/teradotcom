import React, { useState } from 'react';
import Card from '../components/Card';
import { CreditCard, Banknote, Smartphone, Plus, Trash2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import AddWalletModal from '../components/AddWalletModal';
import Modal from '../components/Modal';

const iconMap = {
  'CreditCard': <CreditCard size={24} />,
  'Banknote': <Banknote size={24} />,
  'Smartphone': <Smartphone size={24} />
};

const Wallet = () => {
  const { wallets, totalBalance, resetData, deleteWallet } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleConfirmReset = async () => {
    setIsResetConfirmOpen(false);
    await resetData();
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto p-6 pb-20 md:pb-6">
      <header className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
        <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-widest text-slate-800">Dompet Saya</h1>
        <p className="text-sm text-textMuted">Kelola semua sumber danamu</p>
      </header>

      <Card style={{ backgroundColor: '#0f172a', color: 'white', animationDelay: '100ms' }} className="animate-fade-in-up">
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

      <section className="flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
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

      <section className="flex flex-col gap-4 mt-8 pt-8 border-t border-slate-200 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <button
          onClick={() => setIsResetConfirmOpen(true)}
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

      <Modal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        title="Konfirmasi Reset Data"
      >
        <div className="flex flex-col gap-6">
          <p className="text-slate-600 leading-relaxed">
            Apakah Anda yakin ingin menghapus <strong>SEMUA</strong> transaksi dan meriset saldo? 
            Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
          </p>
          <div className="flex gap-4">
            <button
              key="btn-batal"
              type="button"
              onClick={() => setIsResetConfirmOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              key="btn-reset"
              type="button"
              onClick={handleConfirmReset}
              className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
            >
              Ya, Reset
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Wallet;
