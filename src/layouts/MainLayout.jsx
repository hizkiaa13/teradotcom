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
        <div className="flex-1 w-full bg-[#9DBFDB] md:rounded-[48px] relative overflow-hidden">
          {/* Background Topographic Waves B (Full Page) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            <svg
              className="absolute inset-0 w-full h-full text-white"
              opacity="0.12"
            >
              <defs>
                <pattern
                  id="dense-doodle"
                  width="180"
                  height="180"
                  patternUnits="userSpaceOnUse"
                >
                  <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
                    {/* Top Row */}
                    <path d="M 15,15 L 35,35 L 15,55 L 35,75" /> {/* Zig zag left */}
                    <circle cx="75" cy="30" r="14" /> {/* Circle top */}
                    <path d="M 50,70 L 50,105" /> {/* Vertical line left-middle */}
                    <path d="M 115,15 C 130,35 105,55 120,75" /> {/* Wave middle */}
                    <path d="M 145,20 L 175,50" /> {/* Diagonal line top right */}
                    <path d="M 170,80 L 170,40 L 145,40" /> {/* L-shape top right */}

                    {/* Middle Row */}
                    <path d="M 10,105 C 30,85 55,85 75,105" /> {/* Arch middle left */}
                    <path d="M 10,80 L 30,80" /> {/* Horizontal line left */}
                    <path d="M 90,50 L 100,70" /> {/* Short diagonal */}
                    <path d="M 125,100 L 140,80 L 155,100 L 170,80" /> {/* Zig zag middle right */}
                    <circle cx="160" cy="130" r="12" /> {/* Circle middle right */}
                    <path d="M 85,95 C 95,110 100,115 115,110" /> {/* Small wave center */}
                    <path d="M 135,120 L 135,150" /> {/* Vertical line right */}

                    {/* Bottom Row */}
                    <circle cx="30" cy="145" r="14" /> {/* Circle bottom left */}
                    <path d="M 10,170 L 40,170" /> {/* Horizontal bottom left */}
                    <path d="M 65,140 L 105,140" /> {/* Horizontal middle bottom */}
                    <path d="M 95,170 L 120,170 L 120,145" /> {/* L-shape bottom middle */}
                    <path d="M 145,170 L 175,140" /> {/* Diagonal bottom right */}
                    <path d="M 175,105 L 175,145" /> {/* Vertical bottom right */}
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dense-doodle)" />
            </svg>
          </div>

          {/* Scroll Container (Contains Page Content) */}
          <div className="absolute inset-0 overflow-y-auto z-10">
            <div className="relative">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
