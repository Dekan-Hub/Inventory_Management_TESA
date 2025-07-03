import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTools, FaClipboardList, FaChartBar, FaCogs, FaLaptop } from 'react-icons/fa';
import logo from '../assets/LOGO TESA.png';

const navItems = [
  { label: 'Equipos', path: '/equipos', icon: <FaLaptop /> },
  { label: 'Mantenimientos', path: '/mantenimientos', icon: <FaTools /> },
  { label: 'Solicitudes', path: '/solicitudes', icon: <FaClipboardList /> },
  { label: 'Reportes', path: '/reportes', icon: <FaChartBar /> },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={`h-screen bg-primary text-white flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-accent">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          {!collapsed && <span className="font-bold text-lg tracking-wide">TESA</span>}
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="text-accent focus:outline-none">
          <FaBars size={22} />
        </button>
      </div>
      <nav className="flex-1 mt-4">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 hover:bg-accent hover:text-primary transition-colors duration-200 ${location.pathname.startsWith(item.path) ? 'bg-accent text-primary font-bold' : ''}`}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-accent text-xs text-center opacity-70">
        {!collapsed && '© 2024 Tecnológico San Antonio'}
      </div>
    </aside>
  );
} 