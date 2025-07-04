import React from 'react';

export default function Input({ type = 'text', value, onChange, placeholder, label, error, name, className = '', ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block font-bold mb-1">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary bg-gray-100 ${className}`}
        {...props}
      />
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </div>
  );
} 