/**
 * @file Rutas de Solicitudes
 * @description Define las rutas CRUD para solicitudes con permisos por roles
 */

const express = require('express');
const router = express.Router();
const solicitudesController = require('../controllers/solicitudes.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

// Obtener todas las solicitudes
router.get('/', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), solicitudesController.getAll);

// Obtener solicitud por ID
router.get('/:id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), solicitudesController.getById);

// Crear nueva solicitud
router.post('/', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), solicitudesController.create);

// Actualizar solicitud
router.put('/:id', verifyToken, checkRole(['administrador', 'tecnico']), solicitudesController.update);

// Eliminar solicitud
router.delete('/:id', verifyToken, checkRole(['administrador']), solicitudesController.delete);

module.exports = router; 