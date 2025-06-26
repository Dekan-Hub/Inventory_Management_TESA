import api from './api';

const reportesService = {
  getAll: async () => {
    return api('/reportes'); // Asume un endpoint GET /api/reportes
  },
  getById: async (id) => {
    return api(`/reportes/${id}`);
  },
  create: async (reporteData) => {
    return api('/reportes', 'POST', reporteData);
  },
  exportPdf: async (reportId) => {
    // Asume un endpoint para exportar a PDF que devuelve el archivo
    // Podría necesitar ajustes para manejar la descarga de archivos (blobs)
    return api(`/reportes/${reportId}/pdf`);
  },
  exportExcel: async (reportId) => {
    // Asume un endpoint para exportar a Excel
    // Podría necesitar ajustes para manejar la descarga de archivos (blobs)
    return api(`/reportes/${reportId}/excel`);
  },
};

export default reportesService;