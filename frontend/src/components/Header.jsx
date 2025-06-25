import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Importa el AuthContext para la función de logout

/**
 * Header: Componente de encabezado de la aplicación.
 * Muestra el título de la aplicación, notificaciones y un menú de usuario con opción de cerrar sesión.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.user - Objeto con la información del usuario autenticado (ej. { usuario: '...' }).
 * @param {function} props.onNavigate - Función de navegación que se podría usar si el Header tuviera enlaces de navegación.
 * @param {string} props.currentView - La vista actual, para un posible resaltado o lógica condicional.
 */
const Header = ({ user, onNavigate, currentView }) => {
    // Obtiene la función de logout del AuthContext.
    const { logout } = useContext(AuthContext);

    return (
        // Contenedor principal del encabezado.
        // Clases de Tailwind: fondo blanco, padding, flexbox para alinear elementos, sombra.
        <header className="bg-white p-5 flex justify-between items-center shadow-lg rounded-b-xl">
            {/* Título principal del panel de control. */}
            <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
            {/* Contenedor para elementos del lado derecho: notificaciones y perfil de usuario. */}
            <div className="flex items-center space-x-6">
                {/* Icono de Notificaciones (placeholder).
                    Este botón no tiene funcionalidad implementada, es solo visual. */}
                <button className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </button>
                {/* Contenedor del dropdown de usuario.
                    `relative group` permite que el menú desplegable (absolute) aparezca al pasar el ratón. */}
                <div className="relative group">
                    {/* Botón que muestra el nombre del usuario y su avatar. */}
                    <button className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors duration-200 focus:outline-none">
                        {/* Nombre del usuario, o un placeholder si no está disponible. */}
                        <span className="font-semibold text-lg">{user?.usuario || 'Admin Usuario'}</span>
                        {/* Avatar del usuario. Usando un placeholder de imagen. */}
                        <img
                            className="h-10 w-10 rounded-full object-cover border-2 border-blue-400 shadow-md"
                            src="https://placehold.co/40x40/b3e0ff/0056b3?text=AU" // Placeholder para avatar de usuario
                            alt="User Avatar"
                        />
                    </button>
                    {/* Menú desplegable que aparece al hacer hover sobre el botón del usuario. */}
                    {/* `opacity-0 invisible group-hover:opacity-100 group-hover:visible` para la animación de aparición. */}
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-md shadow-xl py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 origin-top-right">
                        {/* Elementos del menú (simulados como enlaces, sin funcionalidad real en este ejemplo). */}
                        <a href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-150">Perfil</a>
                        <a href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-150">Cambiar contraseña</a>
                        {/* Separador visual. */}
                        <div className="border-t border-gray-100 my-2"></div>
                        {/* Botón para cerrar sesión. Llama a la función `logout` del AuthContext. */}
                        <button onClick={logout} className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150">Cerrar sesión</button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
