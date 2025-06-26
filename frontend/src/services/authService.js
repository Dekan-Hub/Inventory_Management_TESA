// src/services/authService.js
import api from './api';

/**
 * loginUser: Realiza una solicitud de inicio de sesión al backend.
 * @param {string} usuario - El nombre de usuario que el backend espera.
 * @param {string} contraseña - La contraseña que el backend espera.
 * @returns {Promise<object>} Una promesa que resuelve con los datos del usuario y el token.
 * @throws {Error} Lanza un error si la solicitud falla (ej. credenciales inválidas).
 */
export const loginUser = async (usuario, contraseña) => {
  try {
    // **IMPORTANTE**: Los nombres de los campos aquí (usuario, contraseña) deben coincidir
    // EXACAMENTE con lo que tu backend espera en el `req.body` de tu controlador de login.
    // Según tu `auth.controller.js`, tu backend espera `{ usuario, contraseña }`.
    const response = await api.post('/auth/login', { usuario, contraseña });
    return response.data;
  } catch (error) {
    // Si el backend envía un mensaje de error específico, lo usamos. Si no, un mensaje genérico.
    const errorMessage = error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
    throw new Error(errorMessage);
  }
};
