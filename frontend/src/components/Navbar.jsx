import React, { useContext } from 'react'; // Importa React y useContext para usar el AuthContext.
import { AuthContext } from '../context/AuthContext'; // Importa el AuthContext.
import Button from './Button'; // Importa el componente Button reutilizable.

/**
 * Navbar: Componente de la barra de navegación superior.
 * Muestra el nombre del usuario logueado y un botón para cerrar sesión.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.user - Objeto con la información del usuario logueado (ej. { username: '...' }).
 */
const Navbar = ({ user }) => {
    // Obtiene la función `logout` del AuthContext.
    const { logout } = useContext(AuthContext);

    return (
        // Contenedor principal de la barra de navegación.
        // Clases de Tailwind: fondo blanco, padding, sombra, flexbox para alinear elementos, bordes redondeados.
        <div className="bg-white p-4 shadow-md flex justify-between items-center rounded-lg font-inter">
            {/* Sección de bienvenida al usuario. */}
            <div className="text-xl font-semibold text-gray-800">
                Bienvenido, <span className="text-blue-600">{user?.username || 'Invitado'}</span>!
            </div>
            {/* Sección de acciones (cerrar sesión). */}
            <div>
                {/* Botón de cerrar sesión. Al hacer clic, llama a la función `logout` del contexto. */}
                <Button
                    onClick={logout}
                    variant="secondary"
                    className="px-4 py-2 text-md" // Estilos específicos para el botón de logout.
                >
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    );
};

export default Navbar;