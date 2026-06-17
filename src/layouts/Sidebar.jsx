import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, PieChart, Wallet, LogOut } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={32} /> },
  { path: '/input', label: 'Transaksi', icon: <PlusCircle size={32} /> },
  { path: '/report', label: 'Laporan', icon: <PieChart size={32} /> },
  { path: '/wallet', label: 'Dompet', icon: <Wallet size={32} /> },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useFinance();
  const navRef = useRef(null);
  
  const [sliderStyle, setSliderStyle] = useState({ top: 0, height: 0, opacity: 0 });
  const [hoveredPath, setHoveredPath] = useState(null);

  useEffect(() => {
    const targetPath = hoveredPath || location.pathname;
    const targetIndex = navItems.findIndex(item => item.path === targetPath);
    
    if (targetIndex !== -1 && navRef.current) {
      const navElements = navRef.current.querySelectorAll('a');
      const targetElement = navElements[targetIndex];
      
      if (targetElement) {
        setSliderStyle({
          top: targetElement.offsetTop - 14,
          height: targetElement.offsetHeight,
          opacity: 1
        });
      }
    } else {
      setSliderStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [location.pathname, hoveredPath]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-[250px] bg-[#12161F] flex-col z-40 border-r-0">
      <div className="py-8 px-6 border-b border-slate-800 flex flex-col items-center justify-center gap-3">
        <img src="/tera-logo.jpg" alt="Tera Logo" className="w-20 h-20 object-contain rounded-xl" />
        <h1 className="text-2xl font-display uppercase tracking-widest text-[#9DBFDB]">Tera</h1>
      </div>

      <nav 
        ref={navRef}
        className="relative flex-1 w-full py-6 pl-6 pr-0 flex flex-col gap-6" 
        onMouseLeave={() => setHoveredPath(null)}
      >
        <div 
          className="absolute left-0 right-0 sidebar-item-active transition-all duration-300 ease-in-out pointer-events-none"
          style={{
            ...sliderStyle,
            zIndex: 0
          }}
        />
        
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isHovered = hoveredPath === item.path;
          const isHighlighted = isActive || isHovered;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onMouseEnter={() => setHoveredPath(item.path)}
              className={`group relative z-10 flex items-center pl-10 pr-4 py-5 rounded-l-[9999px] text-xl transition-colors hover:!text-slate-700 ${
                isHighlighted 
                  ? 'font-semibold !text-slate-700' 
                  : 'font-medium !text-white'
              }`}
            >
              <div className="flex items-center gap-5 transition-transform duration-300 group-hover:scale-[1.15] group-hover:translate-y-1 origin-left">
                {item.icon}
                <span>{item.label}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>

      <div className="py-6 px-4 border-t border-slate-800">
        <button onClick={handleLogout} className="flex items-center gap-4 py-3 px-4 rounded-md font-medium !text-white font-semibold hover:bg-slate-800 transition-colors w-full">
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
