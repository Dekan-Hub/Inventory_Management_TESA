/**
 * @file Rutas para la gestión de solicitudes de equipos.
 * @description Define las rutas para crear, consultar y actualizar el estado de las solicitudes.
 * Requiere autenticación y autorización.
 */

const express = require('express');
const solicitudController = require('../controllers/solicitudes.controller');
const { verifyToken, checkRole } = require('../middleware/auth'); // Corregido: Usar verifyToken y checkRole

const router = express.Router();

/**
 * @route POST /api/solicitudes
 * @description Crea una nueva solicitud de equipo. Accesible por cualquier usuario autenticado.
 * @access Private (All authenticated users)
 */
router.post('/', verifyToken, solicitudController.crearSolicitud); // Corregido: Usar verifyToken

/**
 * @route GET /api/solicitudes
 * @description Obtiene todas las solicitudes. Accesible por administradores y técnicos.
 * Un usuario normal solo debería ver sus propias solicitudes.
 * @access Private (Admin, Tecnico)
 */
router.get('/', verifyToken, checkRole(['administrador', 'tecnico']), solicitudController.obtenerSolicitudes); // Corregido: Usar verifyToken y checkRole

/**
 * @route GET /api/solicitudes/me
 * @description Obtiene las solicitudes del usuario autenticado.
 * @access Private (All authenticated users)
 */
router.get('/me', verifyToken, async (req, res, next) => { // Corregido: Usar verifyToken
  try {
    // Sobreescribe el filtro para que solo vea sus propias solicitudes
    // Nota: El comentario original usa req.usuario.id, pero tu auth.js adjunta req.user
    // Por favor, verifica si es req.user.id_usuario o req.user.id según tu token.
    req.query.usuarioId = req.user.id_usuario || req.user.id; // Ajuste sugerido si usas 'id_usuario' en el token
    await solicitudController.obtenerSolicitudes(req, res, next);
  } catch (error) {
    next(error);
  }
});


/**
 * @route GET /api/solicitudes/:id
 * @description Obtiene una solicitud por su ID. Accesible por administradores y técnicos.
 * Un usuario normal solo debería ver sus propias solicitudes por ID.
 * @access Private (Admin, Tecnico)
 */
router.get('/:id', verifyToken, checkRole(['administrador', 'tecnico']), solicitudController.obtenerSolicitudPorId); // Corregido: Usar verifyToken y checkRole

/**
 * @route PUT /api/solicitudes/:id/estado
 * @description Actualiza el estado de una solicitud. Solo accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.put('/:id/estado', verifyToken, checkRole(['administrador', 'tecnico']), solicitudController.actualizarEstadoSolicitud); // Corregido: Usar verifyToken y checkRole

/**
 * @route DELETE /api/solicitudes/:id
 * @description Elimina una solicitud por su ID. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.delete('/:id', verifyToken, checkRole(['administrador']), solicitudController.eliminarSolicitud); // Corregido: Usar verifyToken y checkRole

module.exports = router;