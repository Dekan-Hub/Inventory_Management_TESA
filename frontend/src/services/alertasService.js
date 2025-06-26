import api from './api';

const alertasService = {
  getAll: async () => {
    return api('/alertas'); // Asume un endpoint GET /api/alertas
  },
  getById: async (id) => {
    return api(`/alertas/${id}`);
  },
  create: async (alertaData) => {
    return api('/alertas', 'POST', alertaData);
  },
  update: async (id, alertaData) => {
    return api(`/alertas/${id}`, 'PUT', alertaData);
  },
  remove: async (id) => {
    return api(`/alertas/${id}`, 'DELETE');
  },
};

export default alertasService;