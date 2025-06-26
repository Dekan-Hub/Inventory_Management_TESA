import api from './api';

const equiposService = {
  getAll: async () => {
    return api('/equipos'); // Asume un endpoint GET /api/equipos
  },
  getById: async (id) => {
    return api(`/equipos/${id}`);
  },
  create: async (equipoData) => {
    return api('/equipos', 'POST', equipoData);
  },
  update: async (id, equipoData) => {
    return api(`/equipos/${id}`, 'PUT', equipoData);
  },
  remove: async (id) => {
    return api(`/equipos/${id}`, 'DELETE');
  },
};

export default equiposService;