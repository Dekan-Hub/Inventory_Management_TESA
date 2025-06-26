import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * LoginPage: Componente para el formulario de inicio de sesión de la aplicación.
 * Permite a los usuarios ingresar sus credenciales para autenticarse.
 */
const LoginPage = () => {
  const { loginSuccess } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * handleLogin: Función que maneja el envío del formulario de inicio de sesión.
   * Envía las credenciales al backend para autenticación.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log("LoginPage: Intentando login con usuario:", username);
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ usuario: username, contraseña: password }),
      });

      const data = await response.json(); // Parsea la respuesta JSON del servidor
      console.log("LoginPage: Respuesta RAW del backend:", data);

      if (response.ok) {
        // Tu backend envía { token: '...', usuario: { ... } }
        if (data.usuario && data.token) {
          console.log("LoginPage: Objeto 'usuario' recibido del backend:", data.usuario);
          console.log("LoginPage: Rol del usuario recibido (DIRECTAMENTE DEL BACKEND):", data.usuario.rol);
          console.log("LoginPage: Token recibido (primeros 10 chars):", data.token ? data.token.substring(0, 10) + '...' : 'No hay token');
          
          // ¡CRUCIAL! Pasar el token a loginSuccess junto con los datos del usuario
          loginSuccess(data.usuario, data.token);
        } else {
          setError('Respuesta del servidor inválida: Datos de usuario o token no encontrados.');
          console.error("LoginPage: Error: Objeto 'usuario' o 'token' faltante en la respuesta del backend.");
        }
      } else {
        setError(data.message || 'Credenciales inválidas. Por favor, inténtalo de nuevo.');
        console.error("LoginPage: Error de autenticación del backend:", data.message || response.statusText);
      }
    } catch (err) {
      console.error('LoginPage: Error de red o del servidor durante el fetch:', err);
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans bg-gradient-to-br from-purple-900 via-indigo-700 to-amber-400">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border-4 border-blue-500 transform transition-all duration-300 hover:scale-[1.01]">
        <div className="flex justify-center mb-8">
          <img
            src="/tesa logo circular.png"
            alt="Logo de TesaApp"
            className="w-32 h-32 rounded-full border-4 border-blue-400 shadow-lg animate-fade-in-down"
          />
        </div>
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">Iniciar Sesión</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-xl font-semibold text-gray-700 mb-2">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xl font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative text-lg" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-3.5 px-6 border border-transparent rounded-xl shadow-lg text-xl font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
              }`}
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
