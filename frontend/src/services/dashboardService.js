import api from './api';

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    throw error;
  }
};

export const getEquiposStats = async () => {
  try {
    const response = await api.get('/dashboard/equipos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de equipos:', error);
    throw error;
  }
};

export const getMantenimientosStats = async () => {
  try {
    const response = await api.get('/dashboard/mantenimientos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de mantenimientos:', error);
    throw error;
  }
};

export const getSolicitudesStats = async () => {
  try {
    const response = await api.get('/dashboard/solicitudes');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de solicitudes:', error);
    throw error;
  }
}; 