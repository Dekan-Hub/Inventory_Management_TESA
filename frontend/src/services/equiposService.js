import api from './api'; // Importa la instancia de Axios configurada.

/**
 * getEquipos: Obtiene la lista completa de equipos desde el backend.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de objetos equipo.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const getEquipos = async () => {
  try {
    const response = await api.get('/equipos');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al obtener equipos.');
  }
};

/**
 * createEquipo: Crea un nuevo equipo en el backend.
 * @param {object} equipoData - Objeto con los datos del nuevo equipo.
 * @returns {Promise<object>} Una promesa que resuelve con el equipo creado.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const createEquipo = async (equipoData) => {
  try {
    const response = await api.post('/equipos', equipoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al crear equipo.');
  }
};

/**
 * updateEquipo: Actualiza un equipo existente en el backend.
 * @param {string} id - El ID del equipo a actualizar.
 * @param {object} equipoData - Objeto con los datos actualizados del equipo.
 * @returns {Promise<object>} Una promesa que resuelve con el equipo actualizado.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const updateEquipo = async (id, equipoData) => {
  try {
    const response = await api.put(`/equipos/${id}`, equipoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al actualizar equipo.');
  }
};

/**
 * deleteEquipo: Elimina un equipo del backend.
 * @param {string} id - El ID del equipo a eliminar.
 * @returns {Promise<object>} Una promesa que resuelve con la respuesta de éxito de la eliminación.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const deleteEquipo = async (id) => {
  try {
    const response = await api.delete(`/equipos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al eliminar equipo.');
  }
};

