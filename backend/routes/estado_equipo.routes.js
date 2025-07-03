/**
 * @file Rutas de Estados de Equipo
 * @description Define las rutas CRUD para estados de equipo con permisos por roles
 */

const express = require('express');
const router = express.Router();
const estadoEquipoController = require('../controllers/estado_equipo.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

// Obtener todos los estados de equipo
router.get('/', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), estadoEquipoController.obtenerEstadosEquipo);

// Obtener estado de equipo por ID
router.get('/:id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), estadoEquipoController.obtenerEstadoEquipoPorId);

// Crear nuevo estado de equipo
router.post('/', verifyToken, checkRole(['administrador','tecnico']), estadoEquipoController.crearEstadoEquipo);

// Actualizar estado de equipo
router.put('/:id', verifyToken, checkRole(['administrador','tecnico']), estadoEquipoController.actualizarEstadoEquipo);

// Eliminar estado de equipo
router.delete('/:id', verifyToken, checkRole(['administrador','tecnico']), estadoEquipoController.eliminarEstadoEquipo);

module.exports = router; 