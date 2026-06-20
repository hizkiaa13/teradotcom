import React, { createContext, useState, useEffect, useContext } from 'react';

const FinanceContext = createContext();
export const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:3001';


export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('tera_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);

  // Fetch initial data when user changes
  useEffect(() => {
    // Clear data immediately when user changes or logs out
    setTransactions([]);
    setWallets([]);

    if (!user) return;

    const fetchData = async () => {
      try {
        // Added timestamp to prevent browser caching
        const ts = Date.now();
        const walletsRes = await fetch(`${API_BASE}/api/wallets?userId=${user.id}&_=${ts}`);
        const walletsData = await walletsRes.json();
        setWallets(walletsData);

        const txRes = await fetch(`${API_BASE}/api/transactions?userId=${user.id}&_=${ts}`);
        const txData = await txRes.json();
        setTransactions(txData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [user]);

  // Auth actions
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('tera_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tera_user');
  };

  // Derived state
  const totalBalance = wallets.reduce((acc, wallet) => acc + wallet.balance, 0);

  const incomeThisMonth = transactions
    .filter(t => t.type === 'income' && isThisMonth(t.date))
    .reduce((acc, t) => acc + t.amount, 0);

  const expenseThisMonth = transactions
    .filter(t => t.type === 'expense' && isThisMonth(t.date))
    .reduce((acc, t) => acc + t.amount, 0);

  // Helper functions
  function isThisMonth(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }

  // Actions
  const addTransaction = async (transaction) => {
    if (!user) return;
    const walletId = transaction.walletId || (wallets.length > 0 ? wallets[0].id : 1);
    
    try {
      const res = await fetch(`${API_BASE}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...transaction, walletId, userId: user.id })
      });
      const data = await res.json();
      
      if (data.success) {
        setTransactions(prev => [data.transaction, ...prev]);
        setWallets(prevWallets => prevWallets.map(w => 
          w.id === walletId ? { ...w, balance: data.newWalletBalance } : w
        ));
        return data;
      } else {
        throw new Error(data.error || "Gagal menyimpan transaksi");
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
      throw error;
    }
  };

  const addWallet = async (wallet) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/api/wallets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...wallet, userId: user.id })
      });
      const data = await res.json();
      setWallets(prev => [...prev, data]);
    } catch (error) {
      console.error("Error saving wallet:", error);
    }
  };

  const deleteWallet = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus dompet ini beserta semua transaksinya?")) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/wallets/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setWallets(prev => prev.filter(w => w.id !== id));
        setTransactions(prev => prev.filter(t => t.walletId !== id));
      }
    } catch (error) {
      console.error("Error deleting wallet:", error);
    }
  };

  const resetData = async () => {
    if (!user) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/transactions?userId=${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTransactions([]);
        setWallets(prev => prev.map(w => ({ ...w, balance: 0 })));
        alert("Berhasil! Semua data telah direset.");
      }
    } catch (error) {
      console.error("Error resetting data:", error);
    }
  };

  const value = {
    user,
    login,
    logout,
    transactions,
    wallets,
    totalBalance,
    incomeThisMonth,
    expenseThisMonth,
    addTransaction,
    addWallet,
    deleteWallet,
    resetData
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
