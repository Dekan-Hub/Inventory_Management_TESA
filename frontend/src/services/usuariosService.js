import api from './api';

const usuariosService = {
  // Obtener todos los usuarios
  getAll: async () => {
    // Asume que tu backend tiene un endpoint GET /api/users que devuelve una lista de usuarios
    // Ejemplo de respuesta esperada: { success: true, data: [{ id: 1, name: "...", correo: "...", rol: "..." }] }
    try {
      const response = await api('/users');
      // Si tu API devuelve un objeto con una propiedad 'data' que contiene el array de usuarios
      return response.data || [];
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error; // Propaga el error para que el componente que llama pueda manejarlo
    }
  },
  // Obtener un usuario por ID
  getById: async (id) => {
    // Asume un endpoint GET /api/users/{id}
    try {
      const response = await api(`/users/${id}`);
      return response.data; // Devuelve el objeto de usuario directamente
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      throw error;
    }
  },
  // Crear un nuevo usuario
  create: async (userData) => {
    // Asume un endpoint POST /api/users que recibe un objeto de usuario
    // Ejemplo de userData: { name: "Nuevo Usuario", correo: "nuevo@example.com", password: "password123", rol: "usuario" }
    try {
      const response = await api('/users', 'POST', userData);
      return response; // Devuelve la respuesta completa del backend (ej. { success: true, message: "..." })
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  },
  // Actualizar un usuario existente
  update: async (id, userData) => {
    // Asume un endpoint PUT /api/users/{id} que recibe un objeto de usuario con los campos a actualizar
    try {
      const response = await api(`/users/${id}`, 'PUT', userData);
      return response;
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw error;
    }
  },
  // Eliminar un usuario
  remove: async (id) => {
    // Asume un endpoint DELETE /api/users/{id}
    try {
      const response = await api(`/users/${id}`, 'DELETE');
      return response;
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw error;
    }
  },
};

export default usuariosService;
