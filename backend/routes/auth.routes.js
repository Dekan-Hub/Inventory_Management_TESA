/**
 * @file Rutas para la autenticación de usuarios.
 * @description Define las rutas para el inicio de sesión (login) y la obtención del perfil del usuario autenticado.
 */

const express = require('express');
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth'); // Importa el middleware de verificación de token

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @description Inicia sesión de un usuario y retorna un token JWT.
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route GET /api/auth/profile
 * @description Obtiene el perfil del usuario autenticado. Requiere token JWT.
 * @access Private
 */
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;
