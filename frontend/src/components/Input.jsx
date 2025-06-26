import React from 'react';

const Input = ({ label, id, type = 'text', value, onChange, className = '', ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-gray-700 text-sm font-semibold mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={`shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;