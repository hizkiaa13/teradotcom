import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PieChart, Wallet, LogOut, Plus } from 'lucide-react';

const BottomNav = () => {
  const leftItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={32} /> },
    { path: '/report', icon: <PieChart size={32} /> },
  ];
  
  const rightItems = [
    { path: '/wallet', icon: <Wallet size={32} /> },
    { path: '/login', icon: <LogOut size={32} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden h-[120px] flex items-end">
      {/* Custom SVG Background with Notch */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-end">
        <svg 
          width="100%" 
          height="100" 
          viewBox="0 0 400 100" 
          preserveAspectRatio="none" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_-10px_30px_rgba(0,0,0,0.4)]"
        >
          <path 
            d="M0 15H125C150 15 165 75 200 75C235 75 250 15 275 15H400V100H0V15Z" 
            fill="#12161F"
          />
        </svg>
      </div>

      {/* Navigation Content */}
      <nav className="relative z-10 w-full h-[80px] flex justify-between items-center px-6 pb-4">
        {/* Left Section */}
        <div className="flex gap-12 -translate-x-2 translate-y-2">
          {leftItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => 
                `transition-all duration-300 ${isActive ? '!text-[#9DBFDB] scale-125' : '!text-white scale-100'}`
              }
            >
              {item.icon}
            </NavLink>
          ))}
        </div>

        {/* Center FAB */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-12">
          <NavLink 
            to="/input" 
            className="w-20 h-20 bg-[#3B82F6] rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(59,130,246,0.6)] border-4 border-[#12161F] hover:scale-105 active:scale-90 transition-all duration-300"
          >
            <Plus size={44} strokeWidth={3} />
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="flex gap-12 translate-x-2 translate-y-2">
          {rightItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => 
                `transition-all duration-300 ${isActive ? '!text-[#9DBFDB] scale-125' : '!text-white scale-100'}`
              }
            >
              {item.icon}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default BottomNav;
