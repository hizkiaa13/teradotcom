import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PieChart, Wallet, LogOut, Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const { logout } = useFinance();

  const leftItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={28} /> },
    { path: '/report', icon: <PieChart size={28} /> },
  ];
  
  const rightNavItems = [
    { path: '/wallet', icon: <Wallet size={28} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
      <nav className="relative z-10 w-full h-[85px] flex justify-between items-center pb-6">
        {/* Left Section */}
        <div className="flex-1 flex justify-evenly pr-8">
          {leftItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => 
                `transition-all duration-300 flex flex-col items-center gap-1 ${isActive ? '!text-[#9DBFDB] scale-110' : '!text-white/70 scale-100 hover:!text-white'}`
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
            className="group w-[70px] h-[70px] bg-gradient-to-tr from-[#3b82f6] to-[#60a5fa] rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(59,130,246,0.4)] border-4 border-[#12161F] hover:scale-110 hover:shadow-[0_10px_25px_rgba(59,130,246,0.6)] active:scale-95 transition-all duration-300 ease-out"
          >
            <Plus size={30} strokeWidth={2.5} className="transition-transform duration-300 ease-out group-hover:rotate-90" />
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex justify-evenly pl-8">
          {rightNavItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => 
                `transition-all duration-300 flex flex-col items-center gap-1 ${isActive ? '!text-[#9DBFDB] scale-110' : '!text-white/70 scale-100 hover:!text-white'}`
              }
            >
              {item.icon}
            </NavLink>
          ))}
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="transition-all duration-300 flex flex-col items-center gap-1 !text-white/70 scale-100 hover:!text-white"
          >
            <LogOut size={28} />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default BottomNav;
