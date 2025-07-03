/**
 * @file Rutas de Usuarios
 * @description Define las rutas CRUD para usuarios con permisos por roles
 */

const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

// Obtener todos los usuarios
router.get('/', verifyToken, checkRole(['administrador']), usuariosController.getAll);

// Obtener usuario por ID
router.get('/:id', verifyToken, checkRole(['administrador']), usuariosController.getById);

// Crear nuevo usuario
router.post('/', verifyToken, checkRole(['administrador']), usuariosController.create);

// Actualizar usuario
router.put('/:id', verifyToken, checkRole(['administrador']), usuariosController.update);

// Eliminar usuario
router.delete('/:id', verifyToken, checkRole(['administrador']), usuariosController.delete);

// Obtener perfil del usuario autenticado
router.get('/me/profile', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), usuariosController.getProfile);

// Actualizar perfil del usuario autenticado
router.put('/me/profile', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), usuariosController.updateProfile);

module.exports = router; 