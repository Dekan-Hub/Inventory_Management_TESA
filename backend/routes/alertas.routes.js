/**
 * @file Rutas para la gestión de alertas y notificaciones.
 * @description Define las rutas para crear, consultar y marcar alertas como leídas.
 * Requiere autenticación y autorización.
 */

const express = require('express');
const alertaController = require('../controllers/alertas.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/alertas
 * @description Crea una nueva alerta. Solo accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.post('/', verifyToken, checkRole(['administrador', 'tecnico']), alertaController.crearAlerta);

/**
 * @route GET /api/alertas
 * @description Obtiene todas las alertas. Accesible por administradores y técnicos.
 * Un usuario normal solo debería ver sus propias alertas.
 * @access Private (Admin, Tecnico)
 */
router.get('/', verifyToken, checkRole(['administrador', 'tecnico']), alertaController.obtenerAlertas);

/**
 * @route GET /api/alertas/me
 * @description Obtiene las alertas dirigidas al usuario autenticado.
 * @access Private (All authenticated users)
 */
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    // Al re-usar obtenerAlertas, le pasamos el ID del usuario autenticado como filtro.
    // El controlador ya sabe cómo manejar req.query.usuarioDestinoId
    req.query.usuarioDestinoId = req.user.id_usuario;
    await alertaController.obtenerAlertas(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/alertas/:id
 * @description Obtiene una alerta específica por su ID. Accesible por administradores, técnicos
 * y el usuario destino de la alerta.
 * @access Private (Admin, Tecnico, Target User)
 */
router.get('/:id', verifyToken, alertaController.obtenerAlertaPorId); // El controlador ya maneja la autorización interna

/**
 * @route PUT /api/alertas/:id/read
 * @description Marca una alerta como leída. Accesible por administradores, técnicos
 * y el usuario destino de la alerta.
 * @access Private (Admin, Tecnico, Target User)
 */
router.put('/:id/read', verifyToken, alertaController.marcarAlertaComoLeida); // El controlador ya maneja la autorización interna

/**
 * @route DELETE /api/alertas/:id
 * @description Elimina una alerta por su ID. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.delete('/:id', verifyToken, checkRole(['administrador']), alertaController.eliminarAlerta);

module.exports = router;
