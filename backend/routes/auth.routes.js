/**
 * Archivo de rutas para la autenticación.
 * Define los endpoints para registrar y hacer login.
 */

const express = require('express');
const router = express.Router();

// Importamos el controlador de autenticación
const authController = require('../controllers/auth.controller');

// --- Definición de Rutas ---

// Ruta para registrar un nuevo usuario
// POST /api/auth/register
router.post('/register', authController.register);

// Ruta para iniciar sesión
// POST /api/auth/login
router.post('/login', authController.login);


module.exports = router;