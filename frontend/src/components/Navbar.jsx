import React, { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaCog, FaChevronDown } from 'react-icons/fa';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full flex items-center justify-between bg-white shadow px-6 py-3 border-b border-light">
      <h2 className="text-xl font-bold text-primary tracking-wide">{pageNames[page]}</h2>
      <div className="flex items-center gap-4">
        <button onClick={onConfig} className="text-primary hover:text-accent focus:outline-none">
          <FaCog size={22} />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 bg-light px-3 py-1 rounded-full focus:outline-none hover:bg-gray-200"
          >
            <FaUserCircle size={24} className="text-primary" />
            <span className="font-semibold text-dark text-sm">{user?.nombre || 'Usuario'}</span>
            <FaChevronDown className="text-primary" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg border z-50">
              <div className="px-4 py-2 text-xs text-gray-500 border-b">Panel de usuario</div>
              <button className="w-full text-left px-4 py-2 hover:bg-light text-sm" onClick={() => setMenuOpen(false)}>
                Perfil
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-light text-sm text-red-600 border-t" onClick={onLogout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 