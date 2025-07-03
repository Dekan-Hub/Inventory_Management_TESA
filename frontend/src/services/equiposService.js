import api from './api';

export const getEquipos = (params) => api.get('/equipos', { params });
export const getEquipo = (id) => api.get(`/equipos/${id}`);
export const createEquipo = (data) => api.post('/equipos', data);
export const updateEquipo = (id, data) => api.put(`/equipos/${id}`, data);
export const deleteEquipo = (id) => api.delete(`/equipos/${id}`); 