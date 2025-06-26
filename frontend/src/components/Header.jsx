import React from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Header: Componente de cabecera superior del Dashboard.
 * Contiene el título de la sección actual y el icono de configuración.
 */
const Header = () => {
  const { currentPage, setCurrentPage } = useAppContext();
  const { user } = useAuth();

  // Función para obtener un título legible para la página actual
  const getPageTitle = (pageId) => {
    switch (pageId) {
      case 'inicio': return 'Panel de Inicio';
      case 'equipos': return 'Gestión de Equipos';
      case 'mantenimientos': return 'Mantenimientos';
      case 'solicitudes': return 'Solicitudes';
      case 'alertas': return 'Alertas';
      case 'movimientos': return 'Movimientos';
      case 'reportes': return 'Reportes';
      case 'ubicaciones': return 'Gestión de Ubicaciones';
      case 'configuracion': return 'Configuración del Sistema';
      default: return 'Sección Desconocida';
    }
  };

  // Solo el administrador tiene acceso a la configuración
  const canAccessConfig = user?.rol === 'administrador';

  return (
    <header className="bg-white p-6 rounded-2xl shadow-md mb-8 flex justify-between items-center">
      <div>
        {/* Usando tesa-text para el color del texto */}
        <h2 className="text-3xl font-bold text-tesa-text">{getPageTitle(currentPage)}</h2>
        <p className="text-gray-600 mt-1">
          {currentPage === 'inicio' ? `Bienvenido, ${user?.name || user?.usuario || 'Usuario'}!` : `Administra tus ${getPageTitle(currentPage).toLowerCase()}.`}
        </p>
      </div>

      {canAccessConfig && (
        <button
          onClick={() => setCurrentPage('configuracion')}
          className={`flex items-center p-3 rounded-full transition-colors duration-200 ${
            // Cambiado a colores de la paleta tesa o un azul similar si no quieres usar el mismo accent
            currentPage === 'configuracion' ? 'bg-tesa-accent text-white shadow-lg' : 'bg-gray-200 text-tesa-text hover:bg-gray-300'
          }`}
          title="Configuración del Sistema"
        >
          {/* Icono de Configuración  */} 
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path fillRule="evenodd" d="M11.862 1.556a.75.75 0 0 1 .168 1.053l-4.16 5.867a1.501 1.501 0 0 1-1.287.625H2.75c-.621 0-1.125.504-1.125 1.125v2.25c0 .621.504 1.125 1.125 1.125h3.832c.532 0 1.016.29 1.287.75l4.16 5.867a.75.75 0 0 1-1.053.168.75.75 0 0 1-.168-1.053l4.16-5.867A1.501 1.501 0 0 1 17.25 13.5h3.832c.621 0 1.125-.504 1.125-1.125v-2.25c0-.621-.504-1.125-1.125-1.125h-3.832a1.501 1.501 0 0 1-1.287-.75l-4.16-5.867a.75.75 0 0 1-.168-1.053Z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </header>
  );
};

export default Header;
