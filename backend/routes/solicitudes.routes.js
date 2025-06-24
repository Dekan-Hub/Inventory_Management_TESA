/**
 * @file Rutas para la gestión de solicitudes de equipos.
 * @description Define las rutas para crear, consultar y actualizar el estado de las solicitudes.
 * Requiere autenticación y autorización.
 */

const express = require('express');
const solicitudController = require('../controllers/solicitudes.controller');
const { verifyToken, checkRole } = require('../middleware/auth');
const { createSolicitudValidationRules, updateSolicitudStateValidationRules } = require('../middleware/validators/solicitudes.validator');
const handleValidationErrors = require('../middleware/validators/handleValidation');

const router = express.Router();

/**
 * @route POST /api/solicitudes
 * @description Crea una nueva solicitud de equipo. Accesible por cualquier usuario autenticado.
 * @access Private (All authenticated users)
 */
router.post('/', verifyToken, createSolicitudValidationRules(), handleValidationErrors, solicitudController.crearSolicitud);

/**
 * @route GET /api/solicitudes
 * @description Obtiene todas las solicitudes. Accesible por administradores y técnicos.
 * Un usuario normal solo debería ver sus propias solicitudes.
 * @access Private (Admin, Tecnico)
 */
router.get('/', verifyToken, checkRole(['administrador', 'tecnico']), solicitudController.obtenerSolicitudes);

/**
 * @route GET /api/solicitudes/me
 * @description Obtiene las solicitudes del usuario autenticado.
 * @access Private (All authenticated users)
 */
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    req.query.usuarioId = req.user.id_usuario; // Usar req.user.id_usuario según el payload de tu token
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
router.get('/:id', verifyToken, checkRole(['administrador', 'tecnico']), solicitudController.obtenerSolicitudPorId);

/**
 * @route PUT /api/solicitudes/:id/estado
 * @description Actualiza el estado de una solicitud. Solo accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.put('/:id/estado', verifyToken, checkRole(['administrador', 'tecnico']), updateSolicitudStateValidationRules(), handleValidationErrors, solicitudController.actualizarEstadoSolicitud);

/**
 * @route DELETE /api/solicitudes/:id
 * @description Elimina una solicitud por su ID. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.delete('/:id', verifyToken, checkRole(['administrador']), solicitudController.eliminarSolicitud);

module.exports = router;
