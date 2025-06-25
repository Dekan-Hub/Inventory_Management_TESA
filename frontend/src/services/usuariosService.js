import api from './api'; // Importa la instancia de Axios configurada.

/**
 * getUsuarios: Obtiene la lista completa de usuarios desde el backend.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de objetos usuario.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const getUsuarios = async () => {
  try {
    const response = await api.get('/usuarios');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al obtener usuarios.');
  }
};

/**
 * createUsuario: Crea un nuevo usuario en el backend.
 * @param {object} userData - Objeto con los datos del nuevo usuario.
 * @returns {Promise<object>} Una promesa que resuelve con el usuario creado.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const createUsuario = async (userData) => {
  try {
    const response = await api.post('/usuarios', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al crear usuario.');
  }
};

/**
 * updateUsuario: Actualiza un usuario existente en el backend.
 * @param {string} id - El ID del usuario a actualizar.
 * @param {object} userData - Objeto con los datos actualizados del usuario.
 * @returns {Promise<object>} Una promesa que resuelve con el usuario actualizado.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const updateUsuario = async (id, userData) => {
  try {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al actualizar usuario.');
  }
};

/**
 * deleteUsuario: Elimina un usuario del backend.
 * @param {string} id - El ID del usuario a eliminar.
 * @returns {Promise<object>} Una promesa que resuelve con la respuesta de éxito de la eliminación.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const deleteUsuario = async (id) => {
  try {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al eliminar usuario.');
  }
};
