import React from 'react';

export default function Button({ type = 'button', loading, disabled, children, className = '', ...props }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`px-4 py-2 rounded font-bold transition-colors duration-200 shadow-sm bg-primary text-white hover:bg-accent disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </button>
  );
} 