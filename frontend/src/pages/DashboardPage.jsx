import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx'; // ¡NUEVO COMPONENTE DE CABECERA!
// Importa los componentes principales de cada sección (los index.jsx de las subcarpetas)
import EquiposIndex from './Equipos/index.jsx';
import UsuariosIndex from './Usuarios/index.jsx'; // Mantenemos la importación, pero se usará dentro de Configuración
import MantenimientosIndex from './Mantenimientos/index.jsx';
import SolicitudesIndex from './Solicitudes/index.jsx';
import AlertasIndex from './Alertas/index.jsx';
import MovimientosIndex from './Movimientos/index.jsx';
import ReportesIndex from './Reportes/index.jsx';
import UbicacionesIndex from './Ubicaciones/index.jsx';
import ConfiguracionIndex from './Configuracion/index.jsx'; // ¡NUEVA PÁGINA DE CONFIGURACIÓN!
import AccessDenied from '../components/AccessDenied.jsx';

/**
 * Dashboard: Componente principal que se muestra después de que el usuario inicia sesión.
 * Contiene el layout general con un sidebar de navegación y un área de contenido dinámico.
 */
const DashboardPage = () => {
  const { user } = useAuth();
  const { currentPage } = useAppContext();

  // Función auxiliar para verificar permisos (reutilizable)
  const hasPermission = (requiredRoles) => {
    const userRoleStandardized = user?.rol ? user.rol.trim().toLowerCase() : null;
    return userRoleStandardized && requiredRoles.includes(userRoleStandardized);
  };

  // Objeto que mapea los IDs de página a sus componentes y los roles requeridos.
  // Las cadenas de rol aquí son EXACTAMENTE 'administrador', 'técnico', 'usuario'.
  const pageComponents = {
    'inicio': (
      <div className="bg-white p-8 rounded-2xl shadow-md min-h-[60vh] flex flex-col justify-center items-center text-center">
        <h3 className="text-3xl font-bold text-gray-700 mb-4">Bienvenido al Sistema de Gestión de Equipos</h3>
        <p className="text-gray-600 mb-6 max-w-2xl">
          Selecciona una opción del menú lateral para comenzar.
          Tu rol actual es: <span className="font-semibold capitalize text-blue-600">{user?.rol || 'No Definido'}</span>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">Total Equipos: 150</div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">Equipos Operativos: 120</div>
        </div>
      </div>
    ),
    'equipos': hasPermission(['administrador', 'técnico', 'usuario']) ? <EquiposIndex /> : <AccessDenied />,
    'mantenimientos': hasPermission(['administrador', 'técnico']) ? <MantenimientosIndex /> : <AccessDenied />,
    'solicitudes': hasPermission(['administrador', 'usuario']) ? <SolicitudesIndex /> : <AccessDenied />,
    'alertas': hasPermission(['administrador', 'técnico', 'usuario']) ? <AlertasIndex /> : <AccessDenied />,
    'movimientos': hasPermission(['administrador', 'técnico']) ? <MovimientosIndex /> : <AccessDenied />,
    'reportes': hasPermission(['administrador']) ? <ReportesIndex /> : <AccessDenied />,
    'ubicaciones': hasPermission(['administrador', 'técnico']) ? <UbicacionesIndex /> : <AccessDenied />,
    'configuracion': hasPermission(['administrador']) ? <ConfiguracionIndex /> : <AccessDenied />, // Solo administrador para configuración
    // 'usuarios' ya no es una ruta de primer nivel aquí. Su contenido se gestionará dentro de ConfiguracionIndex.
  };

  // Función para renderizar el contenido principal del dashboard basado en currentPage
  const renderDashboardContent = () => {
    const pageComponent = pageComponents[currentPage];
    if (!pageComponent) {
      console.warn(`Página '${currentPage}' no encontrada o acceso denegado. Mostrando AccessDenied.`);
      return <AccessDenied />;
    }
    return pageComponent;
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar de Navegación */}
      <Sidebar />

      {/* Área de Contenido Principal */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        {/* Componente de Cabecera (Header) */}
        <Header />

        {/* Contenido dinámico de la página */}
        <div className="flex-grow"> {/* Flex-grow para que el contenido ocupe el espacio restante */}
          {renderDashboardContent()}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
