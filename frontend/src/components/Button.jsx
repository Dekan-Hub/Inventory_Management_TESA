import React from 'react';

const Button = ({ children, onClick, className = '', ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-75 transition duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
