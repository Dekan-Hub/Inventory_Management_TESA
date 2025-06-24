/**
 * @file backend/config/auth.js
 * @description Configuración de autenticación (JWT).
 * El JWT_SECRET se carga desde .env en app.js y auth.js del middleware.
 * Este archivo puede ser usado para otras configuraciones de autenticación si es necesario.
 */

// Este archivo puede contener configuraciones adicionales de autenticación,
// pero por ahora, el secreto JWT se maneja directamente desde process.env en el middleware y controladores.

module.exports = {
    // secret: process.env.JWT_SECRET, // Ya se accede directamente en el middleware/controller
    // expiresIn: '1h' // Esto también se define en el controlador JWT.sign
};
