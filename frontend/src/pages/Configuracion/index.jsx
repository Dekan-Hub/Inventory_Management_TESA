import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import UsuariosIndex from '../Usuarios/index.jsx'; // Importamos el componente de gestión de usuarios

/**
 * ConfiguracionIndex: Componente principal para la sección de Configuración del sistema.
 * Incluye pestañas para diferentes sub-secciones de configuración, como Usuarios.
 * Accesible solo por: 'administrador'.
 */
const ConfiguracionIndex = () => {
  const { user } = useAuth();
  // Estado para controlar la pestaña activa. Coincide con los IDs de las pestañas.
  const [activeTab, setActiveTab] = useState('general');

  // Solo el administrador tiene acceso a esta página completa
  if (user?.rol !== 'administrador') {
    return (
      <div className="bg-red-100 p-8 rounded-2xl shadow-md text-center min-h-[60vh] flex flex-col items-center justify-center border-2 border-red-300">
        <h3 className="text-3xl font-bold text-red-700 mb-4">Acceso No Autorizado</h3>
        <p className="text-red-600 text-lg font-medium">Solo los administradores pueden acceder a la configuración del sistema.</p>
      </div>
    );
  }

  // Define las pestañas, sus componentes y los roles requeridos para cada una.
  // ¡NOTA: 'respaldos' ha sido eliminado de esta lista!
  const tabs = [
    { id: 'general', label: 'General', component: (
        <div className="p-6 bg-white rounded-xl shadow-inner border border-gray-200 min-h-[40vh]">
          <h4 className="text-2xl font-bold text-tesa-text mb-4">Configuración General</h4>
          <p className="text-gray-600">Configura los ajustes generales del sistema de inventario.</p>
          {/* Contenido de configuración general, similar a tu Imagen6 */}
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="nombreInstitucion" className="block text-sm font-medium text-gray-700">Nombre de la Institución</label>
              <input type="text" id="nombreInstitucion" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" defaultValue="Instituto Tecnológico" />
            </div>
            <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
              <input type="text" id="direccion" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" defaultValue="Av. Principal #123, Ciudad" />
            </div>
            <div>
              <label htmlFor="emailContacto" className="block text-sm font-medium text-gray-700">Email de contacto</label>
              <input type="email" id="emailContacto" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" defaultValue="contacto@instituto.edu" />
            </div>
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input type="tel" id="telefono" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" defaultValue="(123) 456-7890" />
            </div>
            <button className="mt-4 px-6 py-2 bg-tesa-accent text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-colors duration-200">Guardar Cambios</button>
          </div>
        </div>
      ), roles: ['administrador'] },
    { id: 'notificaciones', label: 'Notificaciones', component: (
        <div className="p-6 bg-white rounded-xl shadow-inner border border-gray-200 min-h-[40vh]">
          <h4 className="text-2xl font-bold text-tesa-text mb-4">Ajustes de Notificaciones</h4>
          <p className="text-gray-600">Configura las alertas y notificaciones del sistema.</p>
        </div>
      ), roles: ['administrador'] },
    { id: 'gestion-usuarios', label: 'Gestión de Usuarios', component: <UsuariosIndex />, roles: ['administrador'] }, // ¡AQUÍ se renderiza UsuariosIndex!
  ];

  // Función para renderizar el contenido de la pestaña activa
  const renderTabContent = () => {
    const activeTabItem = tabs.find(tab => tab.id === activeTab);
    if (activeTabItem && activeTabItem.roles.includes(user.rol)) {
      return activeTabItem.component;
    }
    return (
      <div className="bg-red-100 p-8 rounded-2xl shadow-md text-center min-h-[40vh] flex flex-col items-center justify-center border-2 border-red-300">
        <h3 className="text-3xl font-bold text-red-700 mb-4">Acceso Restringido a esta Pestaña</h3>
        <p className="text-red-600 text-lg font-medium">No tienes los permisos para ver esta sub-sección de configuración.</p>
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md min-h-[70vh] flex flex-col">
      <h2 className="text-3xl font-bold text-tesa-text mb-6">Configuración del Sistema</h2>
      {/* Pestañas de Navegación */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          user && tab.roles.includes(user.rol) && (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-6 text-lg font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-b-4 border-tesa-accent text-tesa-accent font-semibold'
                  : 'text-gray-600 hover:text-tesa-accent hover:border-tesa-accent'
              }`}
            >
              {tab.label}
            </button>
          )
        ))}
      </div>

      {/* Contenido de la Pestaña Activa */}
      <div className="flex-grow overflow-auto">
         {renderTabContent()}
      </div>
    </div>
  );
};

export default ConfiguracionIndex;
