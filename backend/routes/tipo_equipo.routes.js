/**
 * @file Rutas de Tipo de Equipo
 * @description Define las rutas CRUD para tipos de equipo con permisos por roles
 */

const express = require('express');
const router = express.Router();
const tipoEquipoController = require('../controllers/tipo_equipo.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

// Obtener todos los tipos de equipo
router.get('/', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), tipoEquipoController.obtenerTiposEquipo);

// Obtener tipo de equipo por ID
router.get('/:id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), tipoEquipoController.obtenerTipoEquipoPorId);

// Crear nuevo tipo de equipo
router.post('/', verifyToken, checkRole(['administrador']), tipoEquipoController.crearTipoEquipo);

// Actualizar tipo de equipo
router.put('/:id', verifyToken, checkRole(['administrador']), tipoEquipoController.actualizarTipoEquipo);

// Eliminar tipo de equipo
router.delete('/:id', verifyToken, checkRole(['administrador']), tipoEquipoController.eliminarTipoEquipo);

module.exports = router; 