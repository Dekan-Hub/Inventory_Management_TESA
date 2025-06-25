// Importa React y hooks esenciales como createContext, useState, useEffect, useCallback.
import React, { createContext, useState, useEffect, useCallback } from 'react';
// Importa las funciones de servicio para el login y logout del backend.
import { loginUser, logoutUser } from '../services/authService';

// Crea el contexto de autenticación.
// Este objeto contendrá el estado y las funciones que se compartirán globalmente.
export const AuthContext = createContext();

/**
 * AuthProvider: Componente proveedor del contexto de autenticación.
 * Envuelve los componentes hijos y les proporciona acceso al estado de autenticación
 * y a funciones para iniciar/cerrar sesión.
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes hijos que tendrán acceso al contexto.
 */
export const AuthProvider = ({ children }) => {
  // Estado para indicar si el usuario está autenticado.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Estado para almacenar la información del usuario autenticado.
  const [user, setUser] = useState(null);
  // Estado para gestionar los mensajes globales (ej. de éxito o error) que se mostrarán en un modal.
  const [globalMessage, setGlobalMessage] = useState({ message: '', type: '' });
  // Estado para indicar si la verificación inicial de autenticación está en curso.
  const [isLoading, setIsLoading] = useState(true);

  /**
   * `checkAuth`: Función para verificar el estado de autenticación desde el localStorage.
   * Utiliza `useCallback` para memorizar la función y evitar que se recree en cada render,
   * lo cual es importante para `useEffect` que la usa como dependencia.
   */
  const checkAuth = useCallback(() => {
    setIsLoading(true); // Inicia el estado de carga.
    // Intenta obtener el token y la información del usuario del localStorage.
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        // Si existen, parsea la información del usuario y actualiza los estados.
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        // Si hay un error al parsear (ej. datos corruptos), limpia el localStorage y desautentica.
        console.error("Error parsing stored user:", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      // Si no hay token o usuario en localStorage, el usuario no está autenticado.
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false); // Finaliza el estado de carga.
  }, []); // Dependencias vacías: esta función solo se crea una vez.

  // `useEffect` para llamar a `checkAuth` al montar el componente `AuthProvider`.
  // Esto asegura que el estado de autenticación se verifique al iniciar la aplicación.
  useEffect(() => {
    checkAuth();
  }, [checkAuth]); // Se re-ejecuta si `checkAuth` cambia (aunque con useCallback no debería).

  /**
   * `login`: Función para manejar el inicio de sesión del usuario.
   * Realiza una llamada al backend, almacena el token y la información del usuario si es exitoso.
   * @param {string} username - Nombre de usuario o correo electrónico.
   * @param {string} password - Contraseña del usuario.
   * @returns {object} Un objeto con `success` (booleano) y `message` (cadena, si hay error).
   */
  const login = async (username, password) => {
    try {
      // Llama al servicio de autenticación para intentar el login.
      const data = await loginUser(username, password);
      // Almacena el token y la información del usuario en localStorage.
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      // Actualiza el estado del contexto.
      setUser(data.usuario);
      setIsAuthenticated(true);
      // Establece un mensaje de éxito global.
      setGlobalMessage({ message: '¡Inicio de sesión exitoso!', type: 'success' });
      return { success: true };
    } catch (error) {
      // Captura y maneja errores durante el login.
      console.error('Error en login:', error);
      // Extrae el mensaje de error de la respuesta del backend o proporciona un mensaje genérico.
      const errorMessage = error.message || 'Error al iniciar sesión. Inténtalo de nuevo.';
      // Establece un mensaje de error global.
      setGlobalMessage({ message: errorMessage, type: 'error' });
      return { success: false, message: errorMessage };
    }
  };

  /**
   * `logout`: Función para manejar el cierre de sesión del usuario.
   * Limpia el token y la información del usuario del localStorage y actualiza el estado.
   */
  const logout = () => {
    logoutUser(); // Llama al servicio para limpiar el localStorage.
    setIsAuthenticated(false); // Establece el usuario como no autenticado.
    setUser(null); // Limpia la información del usuario.
    setGlobalMessage({ message: 'Sesión cerrada correctamente.', type: 'success' }); // Mensaje de éxito.
  };

  // El objeto `authContextValue` contiene todos los estados y funciones
  // que estarán disponibles para los componentes que consuman este contexto.
  const authContextValue = {
    isAuthenticated,
    user,
    isLoading, // Exportar el estado de carga para que los componentes puedan reaccionar a él.
    login,
    logout,
    checkAuth,
    globalMessage,
    setGlobalMessage,
  };

  return (
    // El componente `AuthContext.Provider` hace que `authContextValue` sea accesible
    // para todos los componentes envueltos por este `AuthProvider`.
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
