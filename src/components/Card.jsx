import React from 'react';

const Card = ({ children, className = '', style = {} }) => {
  return (
    <div 
      className={`bg-surface rounded-2xl p-6 shadow-sm transition-shadow duration-150 ease-in-out hover:shadow-md ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;
