import api from './api';

export const getUbicaciones = async () => {
  try {
    const res = await api.get('/ubicaciones');
    return res.data?.data || [];
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    return [];
  }
}; 