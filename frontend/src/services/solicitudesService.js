import api from './api'; // Importa la instancia de Axios configurada.

/**
 * getSolicitudes: Obtiene la lista completa de solicitudes desde el backend.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de objetos solicitud.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const getSolicitudes = async () => {
  try {
    const response = await api.get('/solicitudes');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al obtener solicitudes.');
  }
};

/**
 * createSolicitud: Crea una nueva solicitud en el backend.
 * @param {object} solicitudData - Objeto con los datos de la nueva solicitud.
 * @returns {Promise<object>} Una promesa que resuelve con la solicitud creada.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const createSolicitud = async (solicitudData) => {
  try {
    const response = await api.post('/solicitudes', solicitudData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al crear solicitud.');
  }
};

/**
 * updateSolicitud: Actualiza una solicitud existente en el backend.
 * @param {string} id - El ID de la solicitud a actualizar.
 * @param {object} solicitudData - Objeto con los datos actualizados de la solicitud.
 * @returns {Promise<object>} Una promesa que resuelve con la solicitud actualizada.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const updateSolicitud = async (id, solicitudData) => {
  try {
    const response = await api.put(`/solicitudes/${id}`, solicitudData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al actualizar solicitud.');
  }
};

/**
 * deleteSolicitud: Elimina una solicitud del backend.
 * @param {string} id - El ID de la solicitud a eliminar.
 * @returns {Promise<object>} Una promesa que resuelve con la respuesta de éxito de la eliminación.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const deleteSolicitud = async (id) => {
  try {
    const response = await api.delete(`/solicitudes/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al eliminar solicitud.');
  }
};
