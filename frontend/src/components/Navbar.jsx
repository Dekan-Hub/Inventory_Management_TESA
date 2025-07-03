import React from 'react';
import { FaUserCircle, FaCog } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const pageNames = {
  '/equipos': 'Equipos',
  '/mantenimientos': 'Mantenimientos',
  '/solicitudes': 'Solicitudes',
  '/reportes': 'Reportes',
  '/configuracion': 'Configuración',
  '/dashboard': 'Dashboard',
};

export default function Navbar({ user, onLogout, onConfig }) {
  const location = useLocation();
  const page = Object.keys(pageNames).find(p => location.pathname.startsWith(p)) || '/dashboard';

  return (
    <header className="w-full flex items-center justify-between bg-white shadow px-6 py-3 border-b border-light">
      <h2 className="text-xl font-bold text-primary tracking-wide">{pageNames[page]}</h2>
      <div className="flex items-center gap-4">
        <button onClick={onConfig} className="text-primary hover:text-accent focus:outline-none">
          <FaCog size={22} />
        </button>
        <div className="flex items-center gap-2 bg-light px-3 py-1 rounded-full">
          <FaUserCircle size={24} className="text-primary" />
          <span className="font-semibold text-dark text-sm">{user?.nombre || 'Usuario'}</span>
          <button onClick={onLogout} className="ml-2 text-xs text-accent hover:underline">Salir</button>
        </div>
      </div>
    </header>
  );
} 