import React from 'react';
import { useAuth } from '../context/AuthContext.jsx'; // Correcto: Importamos el hook 'useAuth'
import { useAppContext } from '../context/AppContext.jsx';
import Button from './Button.jsx';

const Navbar = ({ className = '', ...props }) => {
  const { user, logout } = useAuth(); // Usamos el hook 'useAuth' para obtener 'user' y 'logout'
  const { setCurrentPage } = useAppContext();

  const handleLogout = () => {
    logout();
    setCurrentPage('login'); // Redirige al login después de cerrar sesión
  };

  return (
    <header className={`bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200 ${className}`} {...props}>
      <h1 className="text-2xl font-bold text-gray-800">Sistema de Gestión</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">Bienvenido, {user?.name || 'Usuario'}!</span>
        <Button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white shadow"
        >
          Cerrar Sesión
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
