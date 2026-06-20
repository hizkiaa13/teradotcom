import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useFinance } from '../context/FinanceContext';

const MainLayout = () => {
  const { user } = useFinance();

  return (
    <div key={user?.id} className="flex h-screen bg-[#12161F] overflow-hidden">
      <Sidebar />
      <main className="flex-1 w-full md:pl-[250px] md:pr-6 md:py-6 flex flex-col h-full">
        <div className="flex-1 w-full bg-[#9DBFDB] md:rounded-[48px] overflow-y-auto relative">
          {/* Background Aurora Orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            {/* Purple Orb */}
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-400 opacity-20 blur-[100px] sm:w-[500px] sm:h-[500px] sm:blur-[120px]" />
            {/* Blue/Indigo Orb */}
            <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500 opacity-25 blur-[100px] sm:w-[600px] sm:h-[600px] sm:blur-[140px]" />
            {/* Soft Emerald/Teal Orb */}
            <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-emerald-300 opacity-15 blur-[80px]" />
          </div>

          {/* Page Content */}
          <div className="relative z-10">
            <Outlet />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
