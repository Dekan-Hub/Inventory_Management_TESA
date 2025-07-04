import api from './api';

export const getTiposEquipo = async () => {
  try {
    const res = await api.get('/tipo-equipo');
    return res.data?.data || [];
  } catch (error) {
    console.error('Error al obtener tipos de equipo:', error);
    return [];
  }
}; 