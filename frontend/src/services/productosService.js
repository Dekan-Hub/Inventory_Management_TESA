import api from './api'; // Importa la instancia de Axios configurada.

/**
 * getProductos: Obtiene la lista completa de productos desde el backend.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de objetos producto.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const getProductos = async () => {
  try {
    const response = await api.get('/productos');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al obtener productos.');
  }
};

/**
 * createProducto: Crea un nuevo producto en el backend.
 * @param {object} productoData - Objeto con los datos del nuevo producto.
 * @returns {Promise<object>} Una promesa que resuelve con el producto creado.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const createProducto = async (productoData) => {
  try {
    const response = await api.post('/productos', productoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al crear producto.');
  }
};

/**
 * updateProducto: Actualiza un producto existente en el backend.
 * @param {string} id - El ID del producto a actualizar.
 * @param {object} productoData - Objeto con los datos actualizados del producto.
 * @returns {Promise<object>} Una promesa que resuelve con el producto actualizado.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const updateProducto = async (id, productoData) => {
  try {
    const response = await api.put(`/productos/${id}`, productoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al actualizar producto.');
  }
};

/**
 * deleteProducto: Elimina un producto del backend.
 * @param {string} id - El ID del producto a eliminar.
 * @returns {Promise<object>} Una promesa que resuelve con la respuesta de éxito de la eliminación.
 * @throws {Error} Lanza un error si la solicitud falla.
 */
export const deleteProducto = async (id) => {
  try {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Error al eliminar producto.');
  }
};
