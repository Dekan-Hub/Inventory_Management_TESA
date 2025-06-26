import React from 'react';

const Loader = ({ message = 'Cargando...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      <p className="mt-4 text-gray-700">{message}</p>
    </div>
  );
};

export default Loader;