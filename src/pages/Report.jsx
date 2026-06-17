import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import TransactionList from '../components/TransactionList';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { Download, FileSpreadsheet } from 'lucide-react';
import { exportTransactionsToExcel } from '../utils/exportExcel';

const categoryColors = {
  'Makan': '#f59e0b',
  'Transportasi': '#3b82f6',
  'Hiburan': '#8b5cf6',
  'Belanja': '#ec4899',
  'Tagihan': '#ef4444',
  'Gaji': '#10b981',
  'Bonus': '#10b981',
  'Investasi': '#10b981',
  'Lainnya': '#64748b'
};

const Report = () => {
  const { transactions, wallets } = useFinance();
  const [chartType, setChartType] = useState('expense');
  const [filterMonth, setFilterMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // State untuk ekspor Excel
  const todayStr = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const firstDayOfMonthStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  }, []);

  const [startDate, setStartDate] = useState(firstDayOfMonthStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [exportType, setExportType] = useState('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => t.date.startsWith(filterMonth));
  }, [transactions, filterMonth]);

  const pieData = useMemo(() => {
    const relevantTxs = filteredTransactions.filter(t => t.type === chartType);
    const categoryTotals = relevantTxs.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name] || categoryColors['Lainnya']
    }));
  }, [filteredTransactions, chartType]);

  const handleExportExcel = () => {
    if (!startDate || !endDate) {
      alert('Harap tentukan tanggal mulai dan tanggal selesai.');
      return;
    }
    if (startDate > endDate) {
      alert('Tanggal mulai tidak boleh melebihi tanggal selesai.');
      return;
    }

    const filtered = transactions.filter(tx => {
      const matchesDate = tx.date >= startDate && tx.date <= endDate;
      const matchesType = exportType === 'all' || tx.type === exportType;
      return matchesDate && matchesType;
    });

    if (filtered.length === 0) {
      alert('Tidak ada data transaksi pada rentang tanggal dan filter yang dipilih.');
      return;
    }

    const rangeStr = `${startDate}_sd_${endDate}`;
    exportTransactionsToExcel(filtered, wallets, rangeStr);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto p-6 pb-20 md:pb-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
        <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-widest text-slate-800">Laporan</h1>
        <div className="relative group">
          <select 
            className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold 
            text-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer outline-none focus:ring-2 focus:ring-slate-900/5" 
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="2026-06">Juni 2026</option>
            <option value="2026-05">Mei 2026</option>
            <option value="2026-04">April 2026</option>
            <option value="2026-03">Maret 2026</option>
            <option value="2026-02">Februari 2026</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </header>

      {/* Main Grid: Pie Chart & Excel Export Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pie Chart Card */}
        <div className="lg:col-span-7 h-full">
          <Card className="h-full animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex justify-center gap-4 mb-6 p-1 bg-slate-100 rounded-2xl w-fit mx-auto">
              <button 
                onClick={() => setChartType('expense')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${chartType === 'expense' ? 'bg-white shadow-sm text-danger' : 'text-slate-500'}`}
              >
                Pengeluaran
              </button>
              <button 
                onClick={() => setChartType('income')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${chartType === 'income' ? 'bg-white shadow-sm text-success' : 'text-slate-500'}`}
              >
                Pemasukan
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-4 text-center">
              {chartType === 'expense' ? 'Pengeluaran' : 'Pemasukan'} per Kategori
            </h2>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <span className="block w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Excel Export Card */}
        <div className="lg:col-span-5 h-full">
          <Card className="h-full animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-6 text-slate-800">
              <div className="p-2 bg-success/10 text-success rounded-xl">
                <FileSpreadsheet size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Unduh Laporan Excel</h2>
                <p className="text-xs text-slate-400">Ekspor data berdasarkan rentang tanggal</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mulai Tanggal</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-success focus:ring-1 focus:ring-success outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sampai Tanggal</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-success focus:ring-1 focus:ring-success outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tipe Transaksi</label>
                <select 
                  value={exportType} 
                  onChange={(e) => setExportType(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-success focus:ring-1 focus:ring-success outline-none cursor-pointer"
                >
                  <option value="all">Semua Transaksi (Pemasukan & Pengeluaran)</option>
                  <option value="income">Pemasukan Saja</option>
                  <option value="expense">Pengeluaran Saja</option>
                </select>
              </div>

              <button
                onClick={handleExportExcel}
                className="mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-success hover:bg-success/95 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <Download size={18} />
                Ekspor ke Excel
              </button>
            </div>
          </Card>
        </div>
      </div>

      <section className="mt-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <h2 className="text-xl font-semibold mb-4">Rincian Transaksi</h2>
        <Card>
          <TransactionList transactions={filteredTransactions} />
        </Card>
      </section>
    </div>
  );
};

export default Report;
