/**
 * @file Rutas para la gestión de alertas y notificaciones.
 * @description Define las rutas para crear, consultar y marcar alertas como leídas.
 * Requiere autenticación y autorización.
 */

const express = require('express');
const alertaController = require('../controllers/alertas.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/alertas
 * @description Crea una nueva alerta. Solo accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.post('/', protect, authorize('administrador', 'tecnico'), alertaController.crearAlerta);

/**
 * @route GET /api/alertas
 * @description Obtiene todas las alertas. Accesible por administradores y técnicos.
 * Un usuario normal solo debería ver sus propias alertas.
 * @access Private (Admin, Tecnico)
 */
router.get('/', protect, authorize('administrador', 'tecnico'), alertaController.obtenerAlertas);

/**
 * @route GET /api/alertas/me
 * @description Obtiene las alertas dirigidas al usuario autenticado.
 * @access Private (All authenticated users)
 */
router.get('/me', protect, async (req, res, next) => {
  try {
    // Sobreescribe el filtro para que solo vea sus propias alertas
    req.query.usuarioDestinoId = req.usuario.id;
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
router.get('/:id', protect, async (req, res, next) => {
  try {
    const alerta = await alertaController.obtenerAlertaPorId(req, res, next);
    // Lógica adicional para asegurar que un usuario normal solo vea sus propias alertas
    if (req.usuario.rol !== 'administrador' && req.usuario.rol !== 'tecnico' && alerta && alerta.id_usuario_destino !== req.usuario.id) {
      return res.status(403).json({ message: 'Acceso denegado. No tiene permisos para ver esta alerta.' });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /api/alertas/:id/read
 * @description Marca una alerta como leída. Accesible por administradores, técnicos
 * y el usuario destino de la alerta.
 * @access Private (Admin, Tecnico, Target User)
 */
router.put('/:id/read', protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    const alerta = await Alerta.findByPk(id);

    if (!alerta) {
      return res.status(404).json({ message: 'Alerta no encontrada.' });
    }

    // Permitir marcar como leída solo si es admin/tecnico o el usuario destino
    if (req.usuario.rol === 'administrador' || req.usuario.rol === 'tecnico' || alerta.id_usuario_destino === req.usuario.id) {
      await alertaController.marcarAlertaComoLeida(req, res, next);
    } else {
      return res.status(403).json({ message: 'Acceso denegado. No tiene permisos para marcar esta alerta como leída.' });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /api/alertas/:id
 * @description Elimina una alerta por su ID. Solo accesible por administradores.
 * @access Private (Admin only)
 */
router.delete('/:id', protect, authorize('administrador'), alertaController.eliminarAlerta);

module.exports = router;