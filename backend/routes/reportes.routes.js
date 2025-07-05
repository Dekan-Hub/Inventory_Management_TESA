/**
 * @file Rutas de Reportes
 * @description Define las rutas CRUD para reportes con permisos por roles
 */

const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

// Obtener todos los reportes
router.get('/', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), reportesController.getAll);

// Obtener reporte por ID
router.get('/:id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), reportesController.getById);

// Descargar reporte
router.get('/:id/download', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), reportesController.download);

// Crear nuevo reporte
router.post('/', verifyToken, checkRole(['administrador', 'tecnico']), reportesController.create);

// Actualizar reporte
router.put('/:id', verifyToken, checkRole(['administrador', 'tecnico']), reportesController.update);

// Eliminar reporte
router.delete('/:id', verifyToken, checkRole(['administrador']), reportesController.delete);

// Obtener reportes por usuario
router.get('/usuario/:usuario_id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), reportesController.getByUsuario);

module.exports = router; 