import axios from 'axios';
// Conexion con la url del backend para las apis correspondientes
const API_BASE_URL = 'http://localhost:3000/api';

// Crea una instancia de Axios con la URL base y cabeceras predeterminadas.
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', // Tipo de contenido predeterminado para las peticiones.
  },
});

// Interceptor de solicitud de Axios.
// Se ejecuta ANTES de que se envíe cada solicitud HTTP desde la aplicación.
api.interceptors.request.use(
  (config) => {
    // Intenta obtener el token de autenticación del localStorage.
    const token = localStorage.getItem('token');
    // Si existe un token, lo añade a la cabecera 'Authorization' de la solicitud.
    // Esto es crucial para proteger las rutas del backend que requieren autenticación.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Formato Bearer Token estándar.
    }
    return config; // Retorna la configuración modificada.
  },
  (error) => {
    // Si hay un error antes de enviar la solicitud (ej. error de red), lo rechaza.
    return Promise.reject(error);
  }
);

// Interceptor de respuesta de Axios.
// Se ejecuta DESPUÉS de que se recibe una respuesta del backend.
api.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, simplemente la retorna.
  (error) => {
    // Maneja los errores de respuesta.
    // Si el error tiene una respuesta y el código de estado es 401 (No autorizado).
    if (error.response && error.response.status === 401) {
      // Esto significa que el token es inválido o ha expirado.
      // Limpia el token y la información del usuario del localStorage.
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
    // Rechaza la promesa del error para que sea manejado por el bloque `catch`
    // en el código que realizó la llamada a la API.
    return Promise.reject(error);
  }
);

export default api; // Exporta la instancia configurada de Axios.
