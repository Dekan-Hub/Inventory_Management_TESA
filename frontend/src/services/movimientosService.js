import api from './api';

const movimientosService = {
  getAll: async () => {
    return api('/movimientos'); // Asume un endpoint GET /api/movimientos
  },
  getById: async (id) => {
    return api(`/movimientos/${id}`);
  },
  create: async (movimientoData) => {
    return api('/movimientos', 'POST', movimientoData);
  },
  update: async (id, movimientoData) => {
    return api(`/movimientos/${id}`, 'PUT', movimientoData);
  },
  remove: async (id) => {
    return api(`/movimientos/${id}`, 'DELETE');
  },
};

export default movimientosService;