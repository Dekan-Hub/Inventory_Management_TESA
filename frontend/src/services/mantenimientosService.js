import api from './api';

const mantenimientosService = {
  getAll: async () => {
    return api('/mantenimientos'); // Asume un endpoint GET /api/mantenimientos
  },
  getById: async (id) => {
    return api(`/mantenimientos/${id}`);
  },
  create: async (mantenimientoData) => {
    return api('/mantenimientos', 'POST', mantenimientoData);
  },
  update: async (id, mantenimientoData) => {
    return api(`/mantenimientos/${id}`, 'PUT', mantenimientoData);
  },
  remove: async (id) => {
    return api(`/mantenimientos/${id}`, 'DELETE');
  },
};

export default mantenimientosService;
