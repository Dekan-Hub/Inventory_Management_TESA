import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // El objeto user ahora puede contener el token JWT
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect para cargar el estado de autenticación desde localStorage al iniciar la app
  useEffect(() => {
    console.log("AuthContext (Inicio): Intentando cargar usuario desde localStorage.");
    try {
      const storedData = localStorage.getItem('userSession'); // Usamos una nueva clave para toda la sesión
      if (storedData) {
        const sessionData = JSON.parse(storedData);
        // Estandarizamos el rol al rehidratar desde localStorage: minúsculas y sin espacios
        if (sessionData.user && sessionData.user.rol && typeof sessionData.user.rol === 'string') {
          sessionData.user.rol = sessionData.user.rol.trim().toLowerCase();
        }
        setUser(sessionData.user); // Almacena el objeto completo del usuario
        setIsAuthenticated(true);
        console.log("AuthContext (Inicio): Datos de sesión rehidratados:", sessionData);
        console.log("AuthContext (Inicio): Rol rehidratado (estandarizado):", sessionData.user?.rol);
        console.log("AuthContext (Inicio): Token rehidratado (primeros 10 chars):", sessionData.token ? sessionData.token.substring(0, 10) + '...' : 'No hay token');
      } else {
        console.log("AuthContext (Inicio): No se encontró sesión en localStorage.");
      }
    } catch (error) {
      console.error('AuthContext (Inicio): Error al parsear datos de sesión desde localStorage:', error);
      localStorage.removeItem('userSession'); // Limpiar datos inválidos
    } finally {
      setLoading(false);
      console.log("AuthContext (Inicio): Carga inicial finalizada.");
    }
  }, []);

  /**
   * loginSuccess: Función para manejar el inicio de sesión exitoso.
   * Guarda los datos del usuario Y EL TOKEN en el estado y localStorage.
   * @param {object} userData - El objeto de usuario recibido del backend (debe incluir el 'rol').
   * @param {string} token - El token JWT recibido del backend.
   */
  const loginSuccess = (userData, token) => {
    console.log("AuthContext (loginSuccess): Llamado con userData RAW:", userData);
    console.log("AuthContext (loginSuccess): Token RAW:", token ? token.substring(0, 10) + '...' : 'No hay token');

    // Estandarizamos el rol ANTES de guardarlo
    if (userData.rol && typeof userData.rol === 'string') {
      userData.rol = userData.rol.trim().toLowerCase();
    }
    
    // Guardamos el objeto user y el token juntos
    const sessionData = { user: userData, token: token };
    setUser(userData); // El estado 'user' solo necesita los datos del usuario
    setIsAuthenticated(true);
    localStorage.setItem('userSession', JSON.stringify(sessionData)); // Guarda toda la sesión
    console.log("AuthContext (loginSuccess): Usuario y estado de autenticación actualizados.");
    console.log("AuthContext (loginSuccess): Rol del usuario (estandarizado y guardado):", userData.rol);
    console.log("AuthContext (loginSuccess): Token guardado (primeros 10 chars):", token ? token.substring(0, 10) + '...' : 'No hay token');
  };

  /**
   * logout: Función para manejar el cierre de sesión.
   */
  const logout = () => {
    console.log("AuthContext (logout): Iniciando proceso de logout.");
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userSession'); // Limpiar toda la sesión
    console.log("AuthContext (logout): Sesión cerrada y localStorage limpiado.");
  };

  // Log para ver el estado actual del usuario y su rol cada vez que cambian
  useEffect(() => {
    if (!loading) {
      const currentToken = localStorage.getItem('userSession') ? JSON.parse(localStorage.getItem('userSession')).token : null;
      console.log("AuthContext (Estado): isAuthenticated:", isAuthenticated, "User Object:", user, "Rol (del user object):", user?.rol, "Token (del localStorage):", currentToken ? currentToken.substring(0, 10) + '...' : 'No hay token');
    }
  }, [isAuthenticated, user, loading]);

  const contextValue = {
    isAuthenticated,
    user,
    loading,
    loginSuccess,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
