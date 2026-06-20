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
          {/* Background Topographic Waves B (Full Page) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            <svg
              className="absolute inset-0 w-full h-full text-white"
              viewBox="0 0 1000 1000"
              preserveAspectRatio="xMidYMid slice"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.12"
            >
              {/* Ripple Set 1 (Top Right) */}
              <circle cx="900" cy="100" r="150" />
              <circle cx="900" cy="100" r="250" />
              <circle cx="900" cy="100" r="350" />
              <circle cx="900" cy="100" r="450" />
              <circle cx="900" cy="100" r="550" />
              <circle cx="900" cy="100" r="650" />
              <circle cx="900" cy="100" r="750" />
              <circle cx="900" cy="100" r="850" />
              <circle cx="900" cy="100" r="950" />
              <circle cx="900" cy="100" r="1050" />
              <circle cx="900" cy="100" r="1150" />

              {/* Ripple Set 2 (Bottom Left) */}
              <circle cx="100" cy="900" r="100" />
              <circle cx="100" cy="900" r="200" />
              <circle cx="100" cy="900" r="300" />
              <circle cx="100" cy="900" r="400" />
              <circle cx="100" cy="900" r="500" />
              <circle cx="100" cy="900" r="600" />
              <circle cx="100" cy="900" r="750" />
              <circle cx="100" cy="900" r="900" />
              <circle cx="100" cy="900" r="1050" />
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
