import api from './api';

const ubicacionesService = {
  getAll: async () => {
    return api('/ubicaciones'); // Asume un endpoint GET /api/ubicaciones
  },
  getById: async (id) => {
    return api(`/ubicaciones/${id}`);
  },
  create: async (ubicacionData) => {
    return api('/ubicaciones', 'POST', ubicacionData);
  },
  update: async (id, ubicacionData) => {
    return api(`/ubicaciones/${id}`, 'PUT', ubicacionData);
  },
  remove: async (id) => {
    return api(`/ubicaciones/${id}`, 'DELETE');
  },
};

export default ubicacionesService;