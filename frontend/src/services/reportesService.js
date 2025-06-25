import api from './api'; // Importa la instancia de Axios configurada.

/**
 * generateReport: Genera un reporte desde el backend.
 * @param {string} format - El formato del reporte ('pdf' o 'excel').
 * @param {object} reportParams - Parámetros para la generación del reporte (ej. fechas, filtros).
 * @returns {Promise<Blob>} Una promesa que resuelve con el blob del archivo generado.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const generateReport = async (format, reportParams) => {
  try {
    const response = await api.post(`/reportes/generate/${format}`, reportParams, {
      responseType: 'blob', // Importante para manejar archivos binarios.
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error(`Error al generar reporte en ${format}.`);
  }
};

/**
 * getReportesMetadata: Obtiene metadatos de reportes existentes o configuraciones de reportes.
 * (Este es un ejemplo, podrías tener una API para listar reportes generados previamente).
 * @returns {Promise<Array>} Una promesa que resuelve con un array de metadatos de reportes.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const getReportesMetadata = async () => {
  try {
    const response = await api.get('/reportes/metadata');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al obtener metadatos de reportes.');
  }
};
