import api from './api'; // Importa la instancia de Axios configurada.

/**
 * getAlertas: Obtiene la lista completa de alertas desde el backend.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de objetos alerta.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const getAlertas = async () => {
  try {
    const response = await api.get('/alertas');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al obtener alertas.');
  }
};

/**
 * createAlerta: Crea una nueva alerta en el backend.
 * @param {object} alertaData - Objeto con los datos de la nueva alerta.
 * @returns {Promise<object>} Una promesa que resuelve con la alerta creada.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const createAlerta = async (alertaData) => {
  try {
    const response = await api.post('/alertas', alertaData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al crear alerta.');
  }
};

/**
 * updateAlerta: Actualiza una alerta existente en el backend.
 * @param {string} id - El ID de la alerta a actualizar.
 * @param {object} alertaData - Objeto con los datos actualizados de la alerta.
 * @returns {Promise<object>} Una promesa que resuelve con la alerta actualizada.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const updateAlerta = async (id, alertaData) => {
  try {
    const response = await api.put(`/alertas/${id}`, alertaData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al actualizar alerta.');
  }
};

/**
 * deleteAlerta: Elimina una alerta del backend.
 * @param {string} id - El ID de la alerta a eliminar.
 * @returns {Promise<object>} Una promesa que resuelve con la respuesta de éxito de la eliminación.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const deleteAlerta = async (id) => {
  try {
    const response = await api.delete(`/alertas/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al eliminar alerta.');
  }
};

