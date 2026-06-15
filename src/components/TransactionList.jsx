import React from 'react';
import { Utensils, Bus, Film, ShoppingCart, Coffee, DollarSign } from 'lucide-react';

const categoryIcons = {
  'Makan': <Utensils size={20} />,
  'Transportasi': <Bus size={20} />,
  'Hiburan': <Film size={20} />,
  'Belanja': <ShoppingCart size={20} />,
  'Gaji': <DollarSign size={20} />,
  'Bonus': <DollarSign size={20} />,
  'Investasi': <DollarSign size={20} />,
  'Lainnya': <Coffee size={20} />
};

const categoryColors = {
  'Makan': '#f59e0b', // Amber
  'Transportasi': '#3b82f6', // Blue
  'Hiburan': '#8b5cf6', // Purple
  'Belanja': '#ec4899', // Pink
  'Gaji': '#10b981', // Green/Success
  'Bonus': '#10b981', 
  'Investasi': '#10b981',
  'Lainnya': '#64748b' // Slate
};

const TransactionList = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return <div className="text-center p-4 text-sm text-textMuted">Belum ada transaksi</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-4">
            <div 
              className="p-3 rounded-xl"
              style={{ 
                backgroundColor: `${categoryColors[tx.category] || categoryColors['Lainnya']}20`,
                color: categoryColors[tx.category] || categoryColors['Lainnya']
              }}
            >
              {categoryIcons[tx.category] || <DollarSign size={20} />}
            </div>
            <div>
              <div className="text-base font-medium">{tx.category}</div>
              <div className="text-sm text-textMuted">{tx.date}</div>
            </div>
          </div>
          <div className={`text-base font-semibold ${tx.type === 'income' ? 'text-success font-semibold' : ''}`}>
            {tx.type === 'income' ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
