import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken, getAuthToken, removeAuthToken } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // Obtener usuario actual
      api.get('/auth/profile')
        .then(res => {
          if (res.data?.user) {
            setUser(res.data.user);
          } else {
            setUser(null);
            removeAuthToken();
          }
        })
        .catch((error) => {
          console.error('Error al verificar autenticación:', error);
          setUser(null);
          removeAuthToken();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (usuario, contraseña) => {
    const res = await api.post('/auth/login', { usuario, contraseña });
    setAuthToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 