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
              opacity="0.1"
            >
              <defs>
                <pattern
                  id="wiggly-pattern"
                  width="300"
                  height="300"
                  patternUnits="userSpaceOnUse"
                >
                  <g fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
                    {/* Wiggly Path 1 (Top Left) */}
                    <path d="M 30,30 C 50,10 90,20 80,60 C 70,100 30,120 40,160 C 50,180 80,180 100,160" />
                    
                    {/* Wiggly Path 2 (Top Right) */}
                    <path d="M 180,30 C 220,10 250,40 230,80 C 210,120 270,140 280,180" />
                    
                    {/* Wiggly Path 3 (Center Bottom) */}
                    <path d="M 120,220 C 150,200 180,240 160,280 C 140,310 90,280 80,250" />
                    
                    {/* Wiggly Path 4 (Bottom Right) */}
                    <path d="M 220,280 C 260,300 290,270 270,230 C 250,190 220,200 210,170" />
                    
                    {/* Small segments & dots to balance the layout */}
                    <path d="M 130,20 C 150,40 140,70 160,90" />
                    <path d="M 20,250 C 40,280 70,270 70,240" />

                    {/* Dots (Filled Circles) */}
                    <circle cx="110" cy="110" r="10" fill="currentColor" stroke="none" />
                    <circle cx="180" cy="150" r="10" fill="currentColor" stroke="none" />
                    <circle cx="60" cy="200" r="10" fill="currentColor" stroke="none" />
                    <circle cx="230" cy="220" r="10" fill="currentColor" stroke="none" />
                    <circle cx="280" cy="110" r="10" fill="currentColor" stroke="none" />
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#wiggly-pattern)" />
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
