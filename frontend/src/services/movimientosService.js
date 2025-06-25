import api from './api'; // Importa la instancia de Axios configurada.

/**
 * getMovimientos: Obtiene la lista completa de movimientos desde el backend.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de objetos movimiento.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const getMovimientos = async () => {
  try {
    const response = await api.get('/movimientos');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al obtener movimientos.');
  }
};

/**
 * createMovimiento: Crea un nuevo movimiento en el backend.
 * @param {object} movimientoData - Objeto con los datos del nuevo movimiento.
 * @returns {Promise<object>} Una promesa que resuelve con el movimiento creado.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const createMovimiento = async (movimientoData) => {
  try {
    const response = await api.post('/movimientos', movimientoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al crear movimiento.');
  }
};

/**
 * updateMovimiento: Actualiza un movimiento existente en el backend.
 * @param {string} id - El ID del movimiento a actualizar.
 * @param {object} movimientoData - Objeto con los datos actualizados del movimiento.
 * @returns {Promise<object>} Una promesa que resuelve con el movimiento actualizado.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const updateMovimiento = async (id, movimientoData) => {
  try {
    const response = await api.put(`/movimientos/${id}`, movimientoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al actualizar movimiento.');
  }
};

/**
 * deleteMovimiento: Elimina un movimiento del backend.
 * @param {string} id - El ID del movimiento a eliminar.
 * @returns {Promise<object>} Una promesa que resuelve con la respuesta de éxito de la eliminación.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const deleteMovimiento = async (id) => {
  try {
    const response = await api.delete(`/movimientos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al eliminar movimiento.');
  }
};
