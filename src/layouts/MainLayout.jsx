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
              opacity="0.12"
            >
              <defs>
                <pattern
                  id="megamendung"
                  width="200"
                  height="100"
                  patternUnits="userSpaceOnUse"
                >
                  <g fill="none" stroke="currentColor" strokeWidth="1.2">
                    {/* Layer 1 (Outer Cloud) */}
                    <path d="M 20,50 C 20,30 40,20 70,20 C 90,20 105,35 120,48 C 135,35 150,20 170,20 C 190,20 200,30 200,50 C 200,70 190,80 170,80 C 150,80 135,65 120,52 C 105,65 90,80 70,80 C 40,80 20,70 20,50 Z" />
                    {/* Layer 2 (Middle Cloud) */}
                    <path d="M 40,50 C 40,38 52,32 70,32 C 82,32 95,42 120,50 C 145,42 158,32 170,32 C 188,32 180,38 180,50 C 180,62 188,68 170,68 C 158,68 145,58 120,50 C 95,58 82,68 70,68 C 52,68 40,62 40,50 Z" />
                    {/* Layer 3 (Inner Core) */}
                    <path d="M 60,50 C 60,45 65,42 70,42 C 80,42 95,47 120,50 C 145,47 160,42 170,42 C 175,42 180,45 180,50 C 180,55 175,58 170,58 C 160,58 145,53 120,50 C 95,53 80,58 70,58 C 65,58 60,55 60,50 Z" />
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#megamendung)" />
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
