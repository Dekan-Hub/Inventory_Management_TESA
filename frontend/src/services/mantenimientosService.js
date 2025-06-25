import api from './api'; // Importa la instancia de Axios configurada.

/**
 * getMantenimientos: Obtiene la lista completa de mantenimientos desde el backend.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de objetos mantenimiento.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const getMantenimientos = async () => {
  try {
    const response = await api.get('/mantenimientos');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al obtener mantenimientos.');
  }
};

/**
 * createMantenimiento: Crea un nuevo mantenimiento en el backend.
 * @param {object} mantenimientoData - Objeto con los datos del nuevo mantenimiento.
 * @returns {Promise<object>} Una promesa que resuelve con el mantenimiento creado.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const createMantenimiento = async (mantenimientoData) => {
  try {
    const response = await api.post('/mantenimientos', mantenimientoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al crear mantenimiento.');
  }
};

/**
 * updateMantenimiento: Actualiza un mantenimiento existente en el backend.
 * @param {string} id - El ID del mantenimiento a actualizar.
 * @param {object} mantenimientoData - Objeto con los datos actualizados del mantenimiento.
 * @returns {Promise<object>} Una promesa que resuelve con el mantenimiento actualizado.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const updateMantenimiento = async (id, mantenimientoData) => {
  try {
    const response = await api.put(`/mantenimientos/${id}`, mantenimientoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al actualizar mantenimiento.');
  }
};

/**
 * deleteMantenimiento: Elimina un mantenimiento del backend.
 * @param {string} id - El ID del mantenimiento a eliminar.
 * @returns {Promise<object>} Una promesa que resuelve con la respuesta de éxito de la eliminación.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const deleteMantenimiento = async (id) => {
  try {
    const response = await api.delete(`/mantenimientos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al eliminar mantenimiento.');
  }
};
