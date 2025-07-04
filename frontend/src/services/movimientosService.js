import api from './api';

export const getMovimientos = async (params) => {
  try {
    const res = await api.get('/movimientos', { params });
    return res.data?.data || [];
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    return [];
  }
};

export const getMovimiento = async (id) => {
  try {
    const res = await api.get(`/movimientos/${id}`);
    return res.data?.data || null;
  } catch (error) {
    console.error('Error al obtener movimiento:', error);
    return null;
  }
};

export const createMovimiento = async (data) => {
  try {
    const res = await api.post('/movimientos', data);
    return res.data;
  } catch (error) {
    console.error('Error al crear movimiento:', error);
    throw error;
  }
};

export const updateMovimiento = async (id, data) => {
  try {
    const res = await api.put(`/movimientos/${id}`, data);
    return res.data;
  } catch (error) {
    console.error('Error al actualizar movimiento:', error);
    throw error;
  }
};

export const deleteMovimiento = async (id) => {
  try {
    const res = await api.delete(`/movimientos/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error al eliminar movimiento:', error);
    throw error;
  }
}; 