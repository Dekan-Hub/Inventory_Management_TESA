import React from 'react';

/**
 * Sidebar: Componente de barra lateral de navegación.
 * Muestra el logo de la aplicación y una lista de enlaces para navegar entre las diferentes secciones.
 * @param {object} props - Propiedades del componente.
 * @param {function} props.onNavigate - Función que se llama cuando se hace clic en un elemento de navegación
 * para cambiar la vista principal de la aplicación.
 * @param {string} props.currentView - La cadena que representa la vista actual, usada para resaltar el elemento activo.
 */
const Sidebar = ({ onNavigate, currentView }) => {
    // Array de objetos que define los elementos de navegación.
    const navItems = [
        { name: 'Dashboard', icon: '📊', view: 'dashboard' },
        { name: 'Usuarios', icon: '👥', view: 'usuarios' },
        { name: 'Equipos', icon: '📦', view: 'equipos' },
        { name: 'Solicitudes', icon: '📝', view: 'solicitudes' },
        { name: 'Mantenimientos', icon: '🔧', view: 'mantenimientos' },
        { name: 'Movimientos', icon: '🚚', view: 'movimientos' },
        { name: 'Alertas', icon: '🔔', view: 'alertas' },
        { name: 'Reportes', icon: '📈', view: 'reportes' },
        { name: 'Configuración', icon: '⚙️', view: 'configuracion' },
    ];

    return (
        // Contenedor principal de la barra lateral.
        // Clases de Tailwind: ancho fijo, fondo oscuro, texto blanco, altura completa, flexbox vertical, padding, sombra.
        <div className="w-64 bg-gray-900 text-white h-screen flex flex-col p-5 shadow-2xl rounded-r-xl font-inter">
            {/* Título/Logo de la aplicación en el sidebar. */}
            <div className="text-3xl font-bold mb-10 text-blue-400">Inventory App</div>
            {/* Sección de navegación principal. */}
            <nav className="flex-1">
                <ul>
                    {/* Mapea sobre los elementos de navegación para crear un botón por cada uno. */}
                    {navItems.map((item) => (
                        <li key={item.name} className="mb-3">
                            <button
                                // Clases de estilo dinámicas:
                                // Aplica estilos diferentes si el `currentView` coincide con la vista del elemento (`item.view`).
                                className={`flex items-center w-full p-3 rounded-lg text-left transition-all duration-300 ${
                                    currentView === item.view ? 'bg-blue-700 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                                }`}
                                onClick={() => onNavigate(item.view)} // Llama a la función onNavigate con el nombre de la vista.
                            >
                                <span className="mr-4 text-xl">{item.icon}</span> {/* Icono del elemento de navegación. */}
                                <span className="font-medium">{item.name}</span> {/* Nombre del elemento de navegación. */}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            {/* Sección de copyright o información de pie de página en el sidebar. */}
            <div className="text-gray-500 text-xs text-center mt-auto pt-4 border-t border-gray-700">
                © 2023 Inventory App. Todos los derechos reservados.
            </div>
        </div>
    );
};

export default Sidebar;
