import api from './api'; // Importa la instancia de Axios configurada.

/**
 * getDashboardSummary: Obtiene los datos resumidos para el dashboard (tarjetas de estadísticas).
 * @returns {Promise<object>} Una promesa que resuelve con un objeto de resumen (ej. { totalEquipos, solicitudesPendientes, ... }).
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const getDashboardSummary = async () => {
  try {
    // **IMPORTANTE**: Asegúrate de que tu backend tenga un endpoint como /dashboard/summary
    // que devuelva un objeto con las métricas clave.
    // Ejemplo de respuesta esperada: { totalEquipos: 1245, solicitudesPendientes: 32, mantenimientosProximos: 18, usuariosRegistrados: 5 }
    const response = await api.get('/dashboard/summary');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al obtener el resumen del dashboard.');
  }
};

/**
 * getRecentActivity: Obtiene una lista de actividades recientes para el dashboard.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de objetos de actividad.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const getRecentActivity = async () => {
  try {
    // **IMPORTANTE**: Asegúrate de que tu backend tenga un endpoint como /dashboard/recent-activity
    // que devuelva un array de objetos de actividad.
    // Ejemplo de respuesta esperada: [{ type: 'Equipo Añadido', message: 'Laptop Dell XPS 15 añadido', user: 'Admin', date: '2025-06-25T10:00:00Z' }]
    const response = await api.get('/dashboard/recent-activity');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al obtener la actividad reciente del dashboard.');
  }
};
