import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Card from '../components/Card';
import Fab from '../components/Fab';
import TransactionList from '../components/TransactionList';
import { Calendar, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-slate-900">
          Rp {payload[0].value.toLocaleString('id-ID')}
        </p>
      </div>
    );
  }
  return null;
};

const Home = () => {
  const { user, transactions, totalBalance, incomeThisMonth, expenseThisMonth } = useFinance();

  // Generate chart data 
  const chartData = useMemo(() => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];

      const dayTotal = transactions
        .filter(t => t.type === 'expense' && t.date === dateString)
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({
        name: days[d.getDay()],
        amount: dayTotal
      });
    }
    return data;
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);
  
  // Get formatted date
  const todayDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="p-6 md:p-8 flex-1 flex flex-col gap-6 text-slate-800">
      <header className="flex justify-between items-end mt-2 md:mt-4">
        <div>
          <div className="flex items-center gap-2 text-slate-700 mb-2 font-medium">
            <Calendar size={18} />
            <span>{todayDate}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display uppercase tracking-widest text-black">Dashboard</h1>
        </div>
        <Link to="/report" className="text-sm font-semibold hover:underline">Lihat Semua</Link>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Cards + Chart) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Top Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Halo, Budi Card */}
            <Card className="flex flex-col justify-center p-6 md:p-8 shadow-sm border-none rounded-2xl h-full bg-gradient-to-br from-slate-900 to-slate-800 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '0ms' }}>
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 md:mb-6">Hai, {user?.nickname || 'Pengguna'}</h2>
              <div className="flex flex-col gap-2 mt-auto">
                <span className="text-slate-400 font-medium text-sm md:text-base">Total Saldo</span>
                <div className="flex items-center gap-2 md:gap-3">
                  <Wallet className="text-white/90 w-6 h-6 md:w-7 md:h-7" />
                  <span className="text-2xl md:text-3xl font-semibold">Rp.{totalBalance.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </Card>

            {/* Income & Expense Stack */}
            <div className="grid grid-cols-2 md:flex md:flex-col gap-4 md:gap-6">
              <Card className="flex flex-col justify-center p-4 md:p-6 shadow-sm border-none rounded-2xl flex-1 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <div className="p-1 rounded-full bg-success-light text-success">
                    <ArrowUpRight size={16} className="md:w-[18px] md:h-[18px]" />
                  </div>
                  <span className="text-slate-400 font-medium text-xs md:text-sm">Pemasukan</span>
                </div>
                <div className="text-lg md:text-2xl font-semibold text-success truncate">Rp.{incomeThisMonth.toLocaleString('id-ID')}</div>
              </Card>

              <Card className="flex flex-col justify-center p-4 md:p-6 shadow-sm border-none rounded-2xl flex-1 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <div className="p-1 rounded-full bg-danger/10 text-danger">
                    <ArrowDownRight size={16} className="md:w-[18px] md:h-[18px]" />
                  </div>
                  <span className="text-slate-400 font-medium text-xs md:text-sm">Pengeluaran</span>
                </div>
                <div className="text-lg md:text-2xl font-semibold text-danger truncate">Rp.{expenseThisMonth.toLocaleString('id-ID')}</div>
              </Card>
            </div>
            
          </div>

          {/* Chart Section */}
          <Card className="p-6 shadow-sm border-none rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <h3 className="text-lg font-medium text-slate-800 mb-6">Pengeluaran 7 Hari Terakhir</h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} 
                    dy={15} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} 
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                      return value;
                    }}
                    dx={-10} 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                    activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                    dot={{ r: 4, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>

        {/* Right Column (Recent Transactions) */}
        <div className="lg:col-span-1">
          <Card className="p-6 shadow-sm border-none rounded-2xl bg-white h-full min-h-[400px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <h3 className="text-lg font-medium text-slate-800 mb-6">Transaksi Terbaru</h3>
            {recentTransactions.length > 0 ? (
              <TransactionList transactions={recentTransactions} />
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <p>Belum ada transaksi</p>
              </div>
            )}
          </Card>
        </div>

      </div>

      <Fab />

    </div>
  );
};

export default Home;
