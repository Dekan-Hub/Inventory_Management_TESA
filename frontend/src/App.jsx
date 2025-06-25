// Importa React y hooks esenciales como useContext, useEffect, useState.
import React, { useContext, useEffect, useState } from 'react';
// Importa el AuthContext para acceder al estado y funciones de autenticación.
import { AuthContext } from './context/AuthContext';
// Importa las páginas y componentes de layout.
import LoginPage from './pages/LoginPage';
import Layout from './layout/Layout';
import DashboardPage from './pages/DashboardPage';
// **MODIFICADO**: Importa EquiposList para la gestión de equipos
import EquiposList from './pages/Equipos/EquiposList';
// **NUEVO**: Importa las páginas que has listado en tu estructura.
import UsuariosList from './pages/Usuarios/UsuariosList';
import SolicitudesList from './pages/Solicitudes/SolicitudesList';
import MantenimientosList from './pages/Mantenimientos/MantenimientosList';
import MovimientosList from './pages/Movimientos/MovimientosList';
import AlertasList from './pages/Alertas/AlertasList';
import ReportesDashboard from './pages/Reportes/ReportesDashboard';

import Modal from './components/Modal'; // Importa el Modal genérico

// Componente principal de la aplicación.
function App() {
  // Obtiene el estado y las funciones del contexto de autenticación.
  // isAuthenticated: booleano que indica si el usuario está logueado.
  // user: objeto con la información del usuario logueado.
  // checkAuth: función para verificar el estado de autenticación.
  // globalMessage: objeto que contiene el mensaje y tipo del modal global.
  // setGlobalMessage: función para actualizar el mensaje global.
  const { isAuthenticated, user, checkAuth, globalMessage, setGlobalMessage } = useContext(AuthContext);
  // `currentView` gestiona la vista actual que se muestra cuando el usuario está autenticado.
  // Se inicializa en 'dashboard'.
  const [currentView, setCurrentView] = useState('dashboard');

  // `useEffect` para verificar el estado de autenticación al cargar la aplicación.
  // Se ejecuta solo una vez al montar el componente (gracias al array de dependencias vacío).
  // `checkAuth` se vuelve a llamar si su referencia cambia, lo cual no debería ocurrir con useCallback.
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Función para cambiar la vista actual. Esta función se pasa al Sidebar para la navegación.
  const navigateTo = (view) => {
    setCurrentView(view);
  };

  // Función para cerrar el modal de mensaje global.
  const handleCloseGlobalMessage = () => {
    setGlobalMessage({ message: '', type: '', onConfirm: null }); // Limpia el mensaje para ocultar el modal
  };

  // Renderizado condicional: Si el usuario NO está autenticado, muestra la página de Login.
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        {/* Muestra el ModalMessage si hay un globalMessage activo */}
        {globalMessage.message && (
          <Modal
            isOpen={true} // Siempre abierto si hay mensaje
            onClose={handleCloseGlobalMessage}
            title={globalMessage.type === 'error' ? 'Error' : globalMessage.type === 'success' ? 'Éxito' : 'Confirmación'}
            message={globalMessage.message}
            onConfirm={globalMessage.onConfirm}
            confirmText={globalMessage.type === 'confirm' ? 'Confirmar' : 'Aceptar'}
            showCancelButton={globalMessage.type === 'confirm'}
          />
        )}
      </>
    );
  }

  // Renderizado condicional: Si el usuario SÍ está autenticado, muestra el layout principal.
  return (
    // El Layout envuelve el contenido principal de la aplicación (Sidebar + Header + Contenido).
    // Se le pasan el usuario y la función de navegación.
    <Layout user={user} onNavigate={navigateTo} currentView={currentView}>
      {/* Muestra el ModalMessage si hay un globalMessage activo */}
      {globalMessage.message && (
        <Modal
          isOpen={true} // Siempre abierto si hay mensaje
          onClose={handleCloseGlobalMessage}
          title={globalMessage.type === 'error' ? 'Error' : globalMessage.type === 'success' ? 'Éxito' : 'Confirmación'}
          message={globalMessage.message}
          onConfirm={globalMessage.onConfirm}
          confirmText={globalMessage.type === 'confirm' ? 'Confirmar' : 'Aceptar'}
          showCancelButton={globalMessage.type === 'confirm'}
        />
      )}
      {/* Renderizado condicional de las diferentes páginas basado en `currentView`.
          Esto simula un enrutamiento sin necesidad de `react-router-dom` para una SPA. */}
      {currentView === 'dashboard' && <DashboardPage />}
      {currentView === 'usuarios' && <UsuariosList />}
      {currentView === 'equipos' && <EquiposList />}
      {currentView === 'solicitudes' && <SolicitudesList />}
      {currentView === 'mantenimientos' && <MantenimientosList />}
      {currentView === 'movimientos' && <MovimientosList />}
      {currentView === 'alertas' && <AlertasList />}
      {currentView === 'reportes' && <ReportesDashboard />}
      {currentView === 'configuracion' && <p className="p-6 text-gray-700">Página de Configuración (Placeholder)</p>}
    </Layout>
  );
}

export default App; // Exporta el componente App como el componente predeterminado.
