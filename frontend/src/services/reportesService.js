import api from './api';

export const getReportes = (params) => api.get('/reportes', { params });
export const getReporte = (id) => api.get(`/reportes/${id}`);
export const createReporte = (data) => api.post('/reportes', data);
export const updateReporte = (id, data) => api.put(`/reportes/${id}`, data);
export const deleteReporte = (id) => api.delete(`/reportes/${id}`); 