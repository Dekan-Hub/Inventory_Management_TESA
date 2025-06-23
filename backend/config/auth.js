// backend/config/auth.js
module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'tu_secreto_super_secreto', // ¡Cambia esto en producción!
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d' // El token expira en 1 día
};