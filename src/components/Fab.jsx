import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Fab = () => {
  const navigate = useNavigate();

  return (
    <button 
      style={{ backgroundColor: '#3b82f6', color: 'white' }}
      className="fixed bottom-20 right-6 w-14 h-14 rounded-full hidden md:flex items-center justify-center shadow-lg cursor-pointer z-50 hover:opacity-90 hover:-translate-y-[2px] transition-all duration-150 border-none md:bottom-6"
      onClick={() => navigate('/input')}
      aria-label="Add Transaction"
    >
      <Plus size={24} />
    </button>
  );
};

export default Fab;
