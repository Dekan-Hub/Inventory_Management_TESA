import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import logo from '../assets/LOGO TESA.png';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleConfig = () => {
    navigate('/configuracion');
  };

  return (
    <div className="flex min-h-screen bg-light">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} onLogout={logout} onConfig={handleConfig} />
        <main className="flex-1 flex flex-col items-center justify-start p-8 overflow-y-auto">
          <div className="w-full max-w-6xl mx-auto">
            {children}
          </div>
        </main>
        <footer className="w-full text-center text-xs text-gray-400 py-2 border-t border-light bg-white">
          <div className="flex items-center justify-center gap-2">
            <img src={logo} alt="TESA Logo" className="w-6 h-6 inline-block" />
            <span>© 2024 Tecnológico San Antonio - Sistema de Inventario TESA</span>
          </div>
        </footer>
      </div>
    </div>
  );
} 