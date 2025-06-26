import api from './api';

const solicitudesService = {
  getAll: async () => {
    return api('/solicitudes'); // Asume un endpoint GET /api/solicitudes
  },
  getById: async (id) => {
    return api(`/solicitudes/${id}`);
  },
  create: async (solicitudData) => {
    return api('/solicitudes', 'POST', solicitudData);
  },
  update: async (id, solicitudData) => {
    return api(`/solicitudes/${id}`, 'PUT', solicitudData);
  },
  remove: async (id) => {
    return api(`/solicitudes/${id}`, 'DELETE');
  },
};

export default solicitudesService;