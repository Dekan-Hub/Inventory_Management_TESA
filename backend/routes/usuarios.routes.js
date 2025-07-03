const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

/**
 * Rutas para gestión de usuarios
 * Base: /api/usuarios
 */

// Obtener todos los usuarios (con filtros y paginación)
router.get('/', 
  authenticateToken, 
  authorizeRoles(['admin']), 
  usuariosController.getAll
);

// Obtener usuario por ID
router.get('/:id', 
  authenticateToken, 
  authorizeRoles(['admin']), 
  usuariosController.getById
);

// Crear nuevo usuario
router.post('/', 
  authenticateToken, 
  authorizeRoles(['admin']), 
  usuariosController.create
);

// Actualizar usuario
router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['admin']), 
  usuariosController.update
);

// Eliminar usuario
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['admin']), 
  usuariosController.delete
);

// Obtener perfil del usuario actual
router.get('/profile/me', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  usuariosController.getProfile
);

// Actualizar perfil del usuario actual
router.put('/profile/me', 
  authenticateToken, 
  authorizeRoles(['admin', 'tecnico', 'usuario']), 
  usuariosController.updateProfile
);

module.exports = router; 