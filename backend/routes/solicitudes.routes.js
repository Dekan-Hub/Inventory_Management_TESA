/**
 * @file Rutas de Solicitudes
 * @description Define las rutas CRUD para solicitudes con permisos por roles
 */

const express = require('express');
const router = express.Router();
const solicitudesController = require('../controllers/solicitudes.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

// Obtener todas las solicitudes (admin ve todas, usuarios ven solo las suyas)
router.get('/', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), solicitudesController.getAll);

// Obtener mis solicitudes (solo del usuario autenticado)
router.get('/mis-solicitudes', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), solicitudesController.getMisSolicitudes);

// Obtener solicitud por ID
router.get('/:id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), solicitudesController.getById);

// Crear nueva solicitud
router.post('/', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), solicitudesController.create);

// Actualizar solicitud
router.put('/:id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), solicitudesController.update);

// Responder solicitud (solo admin)
router.post('/:id/responder', verifyToken, checkRole(['administrador']), solicitudesController.responderSolicitud);

// Eliminar solicitud (solo admin)
router.delete('/:id', verifyToken, checkRole(['administrador']), solicitudesController.delete);

module.exports = router; 