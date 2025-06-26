import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { useAppContext } from './context/AppContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/DashboardPage.jsx';
// Importa los componentes principales de cada sección (los index.jsx de las subcarpetas)
// Aunque App.jsx no los renderiza directamente, es buena práctica tener la importación si los mapeas en 'routes'
import EquiposIndex from './pages/Equipos/index.jsx';
import UsuariosIndex from './pages/Usuarios/index.jsx';
import MantenimientosIndex from './pages/Mantenimientos/index.jsx';
import SolicitudesIndex from './pages/Solicitudes/index.jsx';
import AlertasIndex from './pages/Alertas/index.jsx';
import MovimientosIndex from './pages/Movimientos/index.jsx';
import ReportesIndex from './pages/Reportes/index.jsx';
import UbicacionesIndex from './pages/Ubicaciones/index.jsx';
import AccessDenied from './components/AccessDenied.jsx';

/**
 * App: Componente principal de la aplicación.
 * Gestiona el enrutamiento (cambio de página) y la protección de rutas
 * basándose en el estado de autenticación y el rol del usuario.
 *
 * Roles esperados del backend: 'administrador', 'técnico', 'usuario'.
 * NOTA: Esta aplicación NO usa Firebase para su lógica de autenticación o base de datos.
 * Toda la gestión de usuarios proviene de tu backend de Node.js.
 */
const App = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { currentPage, setCurrentPage } = useAppContext();

  // Define las rutas de la aplicación y los roles permitidos para cada una.
  // ¡Las cadenas de rol aquí son EXACTAMENTE 'administrador', 'técnico', 'usuario'!
  const routes = {
    'login': { component: LoginPage, public: true },
    'dashboard': { component: Dashboard, roles: ['administrador', 'técnico', 'usuario'] },
    'inicio': { component: Dashboard, roles: ['administrador', 'técnico', 'usuario'] },
    'equipos': { component: Dashboard, roles: ['administrador', 'técnico', 'usuario'] },
    'usuarios': { component: Dashboard, roles: ['administrador'] },
    'mantenimientos': { component: Dashboard, roles: ['administrador', 'técnico'] },
    'solicitudes': { component: Dashboard, roles: ['administrador', 'usuario'] },
    'alertas': { component: Dashboard, roles: ['administrador', 'técnico', 'usuario'] },
    'movimientos': { component: Dashboard, roles: ['administrador', 'técnico'] },
    'reportes': { component: Dashboard, roles: ['administrador'] },
    'ubicaciones': { component: Dashboard, roles: ['administrador', 'técnico'] },
  };

  // Efecto para manejar la redirección y protección de rutas
  useEffect(() => {
    if (authLoading) {
      return; // No hacer nada si la autenticación está cargando
    }

    // Aseguramos que el rol del usuario esté estandarizado para la verificación
    const userRoleStandardized = user?.rol ? user.rol.trim().toLowerCase() : null;
    const currentRoute = routes[currentPage];

    // Caso 1: Usuario no autenticado
    if (!isAuthenticated) {
      if (currentPage !== 'login') {
        console.log(`App: Usuario no autenticado. Redirigiendo a 'login' desde '${currentPage}'.`);
        setCurrentPage('login');
      }
      return;
    }

    // Caso 2: Usuario autenticado
    if (isAuthenticated) {
      // Si está autenticado y en la página de login, redirigir al inicio del dashboard
      if (currentPage === 'login') {
        console.log(`App: Usuario autenticado. Redirigiendo a 'inicio' desde 'login'.`);
        setCurrentPage('inicio');
        return;
      }

      // Caso 3: Proteger rutas por rol
      // Si la ruta actual requiere roles específicos y el rol estandarizado del usuario no está en ellos
      if (currentRoute && currentRoute.roles && !currentRoute.roles.includes(userRoleStandardized)) {
        console.warn(`App: Acceso no autorizado para el rol '${userRoleStandardized}' a la página '${currentPage}'. Redirigiendo a 'inicio'.`);
        setCurrentPage('inicio'); // Redirigir a 'inicio' del dashboard si no tiene permiso
        return; // Detener la ejecución del efecto
      }
    }
  }, [isAuthenticated, authLoading, currentPage, user?.rol, setCurrentPage]); // user?.rol para re-evaluar si el rol cambia

  // Muestra un loader mientras se inicializa la autenticación (del AuthContext)
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <div className="text-xl font-semibold text-gray-700">Cargando aplicación...</div>
      </div>
    );
  }

  // Si no está autenticado, siempre renderiza la página de Login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Si está autenticado, siempre renderiza el Dashboard,
  // y el Dashboard se encargará de renderizar la `currentPage` correcta internamente.
  return <Dashboard />;
};

export default App;
