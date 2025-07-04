import api from './api';

export const getEstadosEquipo = async () => {
  try {
    const res = await api.get('/estado-equipo');
    return res.data?.data || [];
  } catch (error) {
    console.error('Error al obtener estados de equipo:', error);
    return [];
  }
}; 