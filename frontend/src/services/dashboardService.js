import api from './api'; // Importa la instancia de Axios configurada.

/**
 * getDashboardData: Función para obtener los datos necesarios para el dashboard desde el backend.
 * @returns {Promise<object>} Una promesa que resuelve con los datos del dashboard.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const getDashboardData = async () => {
  try {
    // Envía una solicitud GET al endpoint '/dashboard'.
    const response = await api.get('/dashboard');
    return response.data; // Retorna los datos recibidos del backend.
  } catch (error) {
    // Captura y lanza el error, proporcionando un mensaje de error del backend o uno genérico.
    throw error.response?.data || new Error('Error al obtener datos del dashboard.');
  }
};