import React from 'react';

const Tabs = ({ tabs, activeTab, onTabChange, className = '', ...props }) => {
  const activeTabClasses = "border-blue-500 text-blue-600 font-semibold";
  const inactiveTabClasses = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

  return (
    <div className={`border-b border-gray-200 ${className}`} {...props}>
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition duration-200 ${
              activeTab === tab.id ? activeTabClasses : inactiveTabClasses
            }`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
