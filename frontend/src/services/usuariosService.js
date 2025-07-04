import api from './api';

export const getUsuarios = async (params) => {
  try {
    const res = await api.get('/usuarios', { params });
    return res.data?.data || [];
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
};

export const getUsuario = async (id) => {
  try {
    const res = await api.get(`/usuarios/${id}`);
    return res.data?.data || null;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
};

export const createUsuario = async (data) => {
  try {
    const res = await api.post('/usuarios', data);
    return res.data;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

export const updateUsuario = async (id, data) => {
  try {
    const res = await api.put(`/usuarios/${id}`, data);
    return res.data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

export const deleteUsuario = async (id) => {
  try {
    const res = await api.delete(`/usuarios/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
}; 