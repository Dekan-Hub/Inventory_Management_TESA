import api from './api';

export const getMantenimientos = async (params) => {
  try {
    const res = await api.get('/mantenimientos', { params });
    return res.data?.data || [];
  } catch (error) {
    console.error('Error al obtener mantenimientos:', error);
    return [];
  }
};

export const getMantenimiento = async (id) => {
  try {
    const res = await api.get(`/mantenimientos/${id}`);
    return res.data?.data || null;
  } catch (error) {
    console.error('Error al obtener mantenimiento:', error);
    return null;
  }
};

export const createMantenimiento = async (data) => {
  try {
    const res = await api.post('/mantenimientos', data);
    return res.data;
  } catch (error) {
    console.error('Error al crear mantenimiento:', error);
    throw error;
  }
};

export const updateMantenimiento = async (id, data) => {
  try {
    const res = await api.put(`/mantenimientos/${id}`, data);
    return res.data;
  } catch (error) {
    console.error('Error al actualizar mantenimiento:', error);
    throw error;
  }
};

export const deleteMantenimiento = async (id) => {
  try {
    const res = await api.delete(`/mantenimientos/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error al eliminar mantenimiento:', error);
    throw error;
  }
}; 