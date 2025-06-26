import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useAppContext } from '../context/AppContext.jsx';

/**
 * Sidebar: Componente de barra lateral para la navegación del Dashboard.
 * Muestra enlaces condicionalmente basados en el rol del usuario.
 */
const Sidebar = () => {
  const { user, logout } = useAuth();
  const { currentPage, setCurrentPage } = useAppContext();

  // Función auxiliar para verificar si el usuario tiene permiso para un enlace
  const hasPermission = (requiredRoles) => {
    const userRoleStandardized = user?.rol ? user.rol.trim().toLowerCase() : null;
    return userRoleStandardized && requiredRoles.includes(userRoleStandardized);
  };

  // Define los elementos del menú con sus IDs, nombres, iconos y roles requeridos
  // NOTA: 'usuarios' ha sido eliminado de esta lista de primer nivel.
  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7m7-7v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ), roles: ['administrador', 'técnico', 'usuario'] },
    { id: 'equipos', label: 'Equipos', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ), roles: ['administrador', 'técnico', 'usuario'] },
    { id: 'mantenimientos', label: 'Mantenimientos', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.262 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ), roles: ['administrador', 'técnico'] },
    { id: 'solicitudes', label: 'Solicitudes', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ), roles: ['administrador', 'usuario'] },
    { id: 'alertas', label: 'Alertas', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.405L4 17h5m6 0v1a3 3 0 01-3 3H9a3 3 0 01-3-3v-1m6 0a.998.998 0 01-.15.429L9.5 20h5l-.35-.853A.998.998 0 0112 17z" />
      </svg>
    ), roles: ['administrador', 'técnico', 'usuario'] },
    { id: 'movimientos', label: 'Movimientos', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ), roles: ['administrador', 'técnico'] },
    { id: 'reportes', label: 'Reportes', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 2v-6m2 2V7m2 4H9m-6 0h.01M3 11a2 2 0 012-2h4a2 2 0 012 2v3a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 012-2h4a2 2 0 012 2v3a2 2 0 002 2h2a2 2 0 002-2v-3a2 2 0 012-2h4a2 2 0 012 2z" />
      </svg>
    ), roles: ['administrador'] },
    { id: 'ubicaciones', label: 'Ubicaciones', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ), roles: ['administrador', 'técnico'] },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col p-6 rounded-r-3xl shadow-2xl">
      {/* Logo y Título de la App */}
      <div className="flex items-center mb-12">
        {/* Asegúrate de que tu imagen 'tesa logo circular.png' esté en la carpeta 'public' */}
        <img
          src="/tesa logo circular.png"
          alt="Logo de TesaApp"
          className="w-12 h-12 rounded-full mr-4 border-2 border-blue-400"
        />
        <h1 className="text-4xl font-extrabold text-blue-300">TesaApp</h1>
      </div>
      {/* Navegación del Sidebar */}
      <nav className="flex-grow">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            // Solo renderiza el elemento del menú si el usuario tiene los roles requeridos
            hasPermission(item.roles) && (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center w-full py-3.5 px-4 rounded-xl text-lg font-medium transition-all duration-200 ${
                    currentPage === item.id ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              </li>
            )
          ))}
        </ul>
      </nav>
      {/* Sección de información del usuario y botón de logout */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <p className="text-sm text-gray-400 mb-2">Rol Actual:</p>
        <span className="text-xl font-bold text-blue-200 capitalize">{user?.rol || 'Invitado'}</span>
        <button
          onClick={logout}
          className="flex items-center w-full mt-4 py-3 px-4 rounded-xl bg-red-600 text-lg font-bold hover:bg-red-700 transition-all duration-200 shadow-lg justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H5a3 3 0 01-3-3v-7a3 3 0 013-3h6a3 3 0 013 3v1" />
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
