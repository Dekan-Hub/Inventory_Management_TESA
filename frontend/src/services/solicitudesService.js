import api from './api';

export const getSolicitudes = async (params) => {
  try {
    const res = await api.get('/solicitudes', { params });
    return res.data?.data || [];
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    return [];
  }
};

export const getMisSolicitudes = async (params) => {
  try {
    const res = await api.get('/solicitudes/mis-solicitudes', { params });
    return res.data?.data || [];
  } catch (error) {
    console.error('Error al obtener mis solicitudes:', error);
    return [];
  }
};

export const getSolicitud = async (id) => {
  try {
    const res = await api.get(`/solicitudes/${id}`);
    return res.data?.data || null;
  } catch (error) {
    console.error('Error al obtener solicitud:', error);
    return null;
  }
};

export const createSolicitud = async (data) => {
  try {
    const res = await api.post('/solicitudes', data);
    return res.data;
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    throw error;
  }
};

export const updateSolicitud = async (id, data) => {
  try {
    const res = await api.put(`/solicitudes/${id}`, data);
    return res.data;
  } catch (error) {
    console.error('Error al actualizar solicitud:', error);
    throw error;
  }
};

export const responderSolicitud = async (id, data) => {
  try {
    const res = await api.post(`/solicitudes/${id}/responder`, data);
    return res.data;
  } catch (error) {
    console.error('Error al responder solicitud:', error);
    throw error;
  }
};

export const deleteSolicitud = async (id) => {
  try {
    const res = await api.delete(`/solicitudes/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error al eliminar solicitud:', error);
    throw error;
  }
}; 