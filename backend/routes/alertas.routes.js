/**
 * @file Rutas para la gestión de alertas y notificaciones.
 * @description Define las rutas para crear, consultar y marcar alertas como leídas.
 * Requiere autenticación y autorización.
 */

const express = require('express');
const alertaController = require('../controllers/alertas.controller');
const { verifyToken, checkRole } = require('../middleware/auth'); // Corregido: Usar verifyToken y checkRole

const router = express.Router();

/**
 * @route POST /api/alertas
 * @description Crea una nueva alerta. Solo accesible por administradores y técnicos.
 * @access Private (Admin, Tecnico)
 */
router.post('/', verifyToken, checkRole(['administrador', 'tecnico']), alertaController.crearAlerta); // Corregido: Usar verifyToken y checkRole

/**
 * @route GET /api/alertas
 * @description Obtiene todas las alertas. Accesible por administradores y técnicos.
 * Un usuario normal solo debería ver sus propias alertas.
 * @access Private (Admin, Tecnico)
 */
router.get('/', verifyToken, checkRole(['administrador', 'tecnico']), alertaController.obtenerAlertas); // Corregido: Usar verifyToken y checkRole

/**
 * @route GET /api/alertas/me
 * @description Obtiene las alertas dirigidas al usuario autenticado.
 * @access Private (All authenticated users)
 */
router.get('/me', verifyToken, async (req, res, next) => { // Corregido: Usar verifyToken
  try {
    // Sobreescribe el filtro para que solo vea sus propias alertas
    // Nota: Aquí se usaba 'req.usuario.id'. Si tu JWT adjunta el ID como 'req.user.id' o 'req.user.id_usuario',
    // deberías ajustarlo para que coincida con la estructura de tu token.
    req.query.usuarioDestinoId = req.user.id_usuario || req.user.id; // Ajuste sugerido
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
router.get('/:id', verifyToken, async (req, res, next) => { // Corregido: Usar verifyToken
  try {
    // Llama al controlador para obtener la alerta primero
    // Asumiendo que obtenerAlertaPorId devuelve la alerta o la maneja directamente la respuesta
    const alerta = await alertaController.obtenerAlertaPorId(req, res, next); // Esto puede necesitar ser ajustado si el controller ya manda la respuesta

    if (alerta && (req.user.rol !== 'administrador' && req.user.rol !== 'tecnico' && alerta.id_usuario_destino !== (req.user.id_usuario || req.user.id))) {
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
router.put('/:id/read', verifyToken, async (req, res, next) => { // Corregido: Usar verifyToken
  try {
    const { id } = req.params;
   
    if (!alerta) {
      return res.status(404).json({ message: 'Alerta no encontrada.' });
     }

     if (req.user.rol === 'administrador' || req.user.rol === 'tecnico' || alerta.id_usuario_destino === (req.user.id_usuario || req.user.id)) {
      await alertaController.marcarAlertaComoLeida(req, res, next); // Aquí se asume que el controlador hace el trabajo
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
router.delete('/:id', verifyToken, checkRole(['administrador']), alertaController.eliminarAlerta); // Corregido: Usar verifyToken y checkRole

module.exports = router;