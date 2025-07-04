import React from 'react';

export default function Tabs({ tabs, value, onChange, children }) {
  return (
    <div>
      <div className="flex gap-2 border-b mb-4">
        {tabs.map(tab => (
          <button
            key={tab.value}
            className={`px-4 py-2 font-bold border-b-2 transition-colors duration-200 ${value === tab.value ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-primary'}`}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
} 