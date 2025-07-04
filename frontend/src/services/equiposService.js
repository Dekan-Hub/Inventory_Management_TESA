import api from './api';

export const getEquipos = async (params) => {
  try {
    const res = await api.get('/equipos', { params });
    // El backend devuelve { data: [...], message: "...", pagination: {...} }
    return res.data?.data || [];
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    return [];
  }
};

export const getEquipo = async (id) => {
  try {
    const res = await api.get(`/equipos/${id}`);
    return res.data?.data || null;
  } catch (error) {
    console.error('Error al obtener equipo:', error);
    return null;
  }
};

export const createEquipo = async (data) => {
  try {
    const res = await api.post('/equipos', data);
    return res.data;
  } catch (error) {
    console.error('Error al crear equipo:', error);
    throw error;
  }
};

export const updateEquipo = async (id, data) => {
  try {
    const res = await api.put(`/equipos/${id}`, data);
    return res.data;
  } catch (error) {
    console.error('Error al actualizar equipo:', error);
    throw error;
  }
};

export const deleteEquipo = async (id) => {
  try {
    const res = await api.delete(`/equipos/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error al eliminar equipo:', error);
    throw error;
  }
}; 