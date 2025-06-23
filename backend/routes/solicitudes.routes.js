/**
 * @file Rutas para la gestión de solicitudes de equipos.
 * @description Define las rutas para crear, consultar y actualizar el estado de las solicitudes.
 * Requiere autenticación y autorización.
 */

const express = require('express');
const solicitudController = require('../controllers/solicitudes.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/solicitudes
 * @description Crea una nueva solicitud de equipo. Accesible por cualquier usuario autenticado.
 * @access Private (All authenticated users)
 */
router.post('/', protect, solicitudController.crearSolicitud);

/**
 * @route GET /api/solicitudes
 * @description Obtiene todas las solicitudes. Accesible por administradores y técnicos.
 * Un usuario normal solo debería ver sus propias solicitudes.
 * @access Private (Admin, Tecnico)
 */
router.get('/', protect, authorize('administrador', 'tecnico'), solicitudController.obtenerSolicitudes);

/**
 * @route GET /api/solicitudes/me
 * @description Obtiene las solicitudes del usuario autenticado.
 * @access Private (All authenticated users)
 */
router.get('/me', protect, async (req, res, next) => {
  try {
    // Sobreescribe el filtro para que solo vea sus propias solicitudes
    req.query.usuarioId = req.usuario.id;
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
router.get('/:id', protect, authorize('administrador', 'tecnico'), solicitudController.obtenerSolicitudPorId);

/**
 * @route PUT /api/solicitudes/:id/estado
 * @description Actualiza el estado de una solicitud. Solo accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.put('/:id/estado', protect, authorize('administrador', 'tecnico'), solicitudController.actualizarEstadoSolicitud);

/**
 * @route DELETE /api/solicitudes/:id
 * @description Elimina una solicitud por su ID. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.delete('/:id', protect, authorize('administrador'), solicitudController.eliminarSolicitud);

module.exports = router;