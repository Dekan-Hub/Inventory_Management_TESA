/**
 * @file Rutas de Alertas
 * @description Define las rutas CRUD para alertas con permisos por roles
 */

const express = require('express');
const router = express.Router();
const alertasController = require('../controllers/alertas.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

// Obtener todas las alertas
router.get('/', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), alertasController.getAll);

// Obtener alerta por ID
router.get('/:id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), alertasController.getById);

// Crear nueva alerta
router.post('/', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), alertasController.create);

// Actualizar alerta
router.put('/:id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), alertasController.update);

// Eliminar alerta
router.delete('/:id', verifyToken, checkRole(['administrador']), alertasController.delete);

// Obtener alertas por equipo
router.get('/equipo/:equipo_id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), alertasController.getByEquipo);

module.exports = router; 