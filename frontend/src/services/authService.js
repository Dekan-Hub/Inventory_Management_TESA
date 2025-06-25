import api from './api'; // Importa la instancia de Axios configurada.

/**
 * loginUser: Función para realizar una solicitud de inicio de sesión al backend.
 * @param {string} usuario - El nombre de usuario o correo electrónico para el login.
 * @param {string} contraseña - La contraseña del usuario.
 * @returns {Promise<object>} Una promesa que resuelve con los datos de respuesta del backend (token, usuario).
 * @throws {Error} Lanza un error si la solicitud falla, con el mensaje de error del backend.
 */
export const loginUser = async (usuario, contraseña) => {
  try {
    // Envía una solicitud POST al endpoint '/auth/login' con las credenciales.
    const response = await api.post('/auth/login', { usuario, contraseña });
    return response.data; // Retorna los datos recibidos del backend (ej. { token: '...', usuario: {...} }).
  } catch (error) {
    // Si hay un error en la solicitud, lanza el error de la respuesta del backend
    // o un error genérico si no hay respuesta del servidor.
    throw error.response?.data || new Error('Error de red o servidor.');
  }
};

/**
 * logoutUser: Función para simular el cierre de sesión.
 * En esta implementación, simplemente limpia los datos de autenticación del localStorage.
 * En un sistema real, podría también enviar una solicitud al backend para invalidar el token.
 */
export const logoutUser = () => {
  // Elimina el token de autenticación del localStorage.
  localStorage.removeItem('token');
  // Elimina la información del usuario del localStorage.
  localStorage.removeItem('user');
  // Si tu backend tuviera un endpoint de logout para invalidar tokens, lo llamarías aquí:
  // await api.post('/auth/logout');
};
