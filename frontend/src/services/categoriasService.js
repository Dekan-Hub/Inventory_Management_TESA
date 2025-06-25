import api from './api'; // Importa la instancia de Axios configurada.

/**
 * getCategorias: Obtiene la lista completa de categorías desde el backend.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de objetos categoría.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const getCategorias = async () => {
  try {
    const response = await api.get('/categorias');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al obtener categorías.');
  }
};

/**
 * createCategoria: Crea una nueva categoría en el backend.
 * @param {object} categoriaData - Objeto con los datos de la nueva categoría.
 * @returns {Promise<object>} Una promesa que resuelve con la categoría creada.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const createCategoria = async (categoriaData) => {
  try {
    const response = await api.post('/categorias', categoriaData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al crear categoría.');
  }
};

/**
 * updateCategoria: Actualiza una categoría existente en el backend.
 * @param {string} id - El ID de la categoría a actualizar.
 * @param {object} categoriaData - Objeto con los datos actualizados de la categoría.
 * @returns {Promise<object>} Una promesa que resuelve con la categoría actualizada.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const updateCategoria = async (id, categoriaData) => {
  try {
    const response = await api.put(`/categorias/${id}`, categoriaData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al actualizar categoría.');
  }
};

/**
 * deleteCategoria: Elimina una categoría del backend.
 * @param {string} id - El ID de la categoría a eliminar.
 * @returns {Promise<object>} Una promesa que resuelve con la respuesta de éxito de la eliminación.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const deleteCategoria = async (id) => {
  try {
    const response = await api.delete(`/categorias/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al eliminar categoría.');
  }
};
