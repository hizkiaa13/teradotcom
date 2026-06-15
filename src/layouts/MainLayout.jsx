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
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
