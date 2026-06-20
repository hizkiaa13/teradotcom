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
          {/* Background Topographic Waves */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            <svg
              className="absolute -top-16 -right-16 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] text-slate-800"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.08"
            >
              <path d="M 50,0 Q 60,35 100,50" />
              <path d="M 40,0 Q 52,42 100,60" />
              <path d="M 30,0 Q 45,50 100,70" />
              <path d="M 20,0 Q 37,58 100,80" />
              <path d="M 10,0 Q 30,66 100,90" />
              <path d="M 0,0 Q 22,74 100,100" />
            </svg>
            <svg
              className="absolute -bottom-16 -left-16 w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] text-slate-800"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.08"
            >
              <path d="M 0,50 Q 35,60 50,100" />
              <path d="M 0,40 Q 42,52 60,100" />
              <path d="M 0,30 Q 50,45 70,100" />
              <path d="M 0,20 Q 58,37 80,100" />
              <path d="M 0,10 Q 66,30 90,100" />
              <path d="M 0,0 Q 74,22 100,100" />
            </svg>
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
