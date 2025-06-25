// Importa React y hooks como useState y useContext.
import React, { useState, useContext } from 'react';
// Importa el AuthContext para acceder a la función de login.
import { AuthContext } from '../context/AuthContext';
// Importa los componentes reutilizables Input y Button.
import Input from '../components/Input';
import Button from '../components/Button';

/**
 * LoginPage: Componente de la página de inicio de sesión.
 * Permite a los usuarios introducir sus credenciales para autenticarse en la aplicación.
 */
const LoginPage = () => {
    // Estado para almacenar el nombre de usuario/correo electrónico.
    const [username, setUsername] = useState('');
    // Estado para almacenar la contraseña.
    const [password, setPassword] = useState('');
    // Estado para controlar el estado de carga durante el proceso de login.
    const [isLoading, setIsLoading] = useState(false);
    // Obtiene la función `login` del AuthContext para manejar la autenticación.
    const { login } = useContext(AuthContext);

    /**
     * `handleLogin`: Función que se ejecuta al intentar iniciar sesión.
     * Llama a la función `login` del contexto de autenticación y gestiona el estado de carga.
     */
    const handleLogin = async () => {
        setIsLoading(true); // Activa el estado de carga.
        // Llama a la función de login del AuthContext.
        const result = await login(username, password);
        if (result.success) {
            // Si el login es exitoso, no es necesario hacer nada aquí;
            // el `App.jsx` reaccionará al cambio en `isAuthenticated` del AuthContext
            // y navegará automáticamente a la página principal.
        }
        setIsLoading(false); // Desactiva el estado de carga.
    };

    return (
        // Contenedor principal de la página de login.
        // Centra el contenido en la pantalla con un fondo gris claro.
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
            {/* Contenedor del formulario de login. */}
            {/* Clases de Tailwind: fondo blanco, padding, bordes redondeados, sombra, ancho máximo. */}
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                {/* Sección del encabezado del formulario. */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-blue-700 mb-3 drop-shadow-md">INVENTORY-MANAGEMENT TESA</h1>
                    <p className="text-gray-600 text-lg">Bienvenido de nuevo</p>
                </div>
                {/* Contenedor de los campos de entrada y el botón. */}
                <div className="space-y-6">
                    {/* Componente Input para el nombre de usuario/correo electrónico. */}
                    <Input
                        label="Correo Electrónico / Usuario"
                        id="username"
                        type="text"
                        placeholder="tu.correo@ejemplo.com"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Actualiza el estado `username` al escribir.
                        disabled={isLoading} // Deshabilita el input si está cargando.
                    />
                    {/* Componente Input para la contraseña. */}
                    <Input
                        label="Contraseña"
                        id="password"
                        type="password"
                        placeholder="******************"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Actualiza el estado `password` al escribir.
                        disabled={isLoading} // Deshabilita el input si está cargando.
                    />
                    {/* Componente Button para enviar el formulario. */}
                    <Button
                        onClick={handleLogin} // Llama a `handleLogin` al hacer clic.
                        disabled={isLoading} // Deshabilita el botón si está cargando.
                        className="w-full" // Ocupa todo el ancho.
                    >
                        {/* Texto del botón que cambia si está cargando. */}
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
