/**
 * @file backend/routes/usuarios.routes.js
 * @description Define las rutas de la API para la gestión de usuarios.
 * Incluye rutas para crear, obtener, actualizar y eliminar usuarios.
 * La ruta de creación (`POST /`) se ha hecho pública para permitir el registro inicial.
 */

const express = require('express');
const router = express.Router(); // Crea un nuevo enrutador de Express

const usuarioController = require('../controllers/usuarios.controller'); // Importa el controlador de usuarios
const { verifyToken, checkRole } = require('../middleware/auth'); // Importa los middlewares de autenticación y autorización
const { createUserValidationRules, updateUserValidationRules } = require('../middleware/validators/usuarios.validator'); // Importa las reglas de validación
const validate = require('../middleware/validate'); // Importa el middleware de validación general

// --- Rutas de Usuarios ---

/**
 * @route POST /api/usuarios
 * @description Crea un nuevo usuario.
 * @access Público (PARA REGISTRO INICIAL)
 * Se ha eliminado `verifyToken` y `checkRole` para esta ruta.
 */
router.post(
    '/',
    createUserValidationRules(), // Aplica las reglas de validación para la creación
    validate, // Middleware para procesar los resultados de la validación
    usuarioController.crearUsuario // Controlador para manejar la lógica de creación
);

/**
 * @route GET /api/usuarios
 * @description Obtiene todos los usuarios, con opciones de búsqueda y filtro.
 * @access Privado (Requiere 'administrador' o 'tecnico' o 'usuario' si deseas que todos los roles puedan ver todos los usuarios)
 * Si solo admins deben ver todos los usuarios, usa ['administrador']
 */
router.get(
    '/',
    verifyToken, // Requiere un token JWT válido
    checkRole(['administrador', 'tecnico', 'usuario']), // Roles autorizados para ver todos los usuarios
    usuarioController.obtenerUsuarios
);

/**
 * @route GET /api/usuarios/:id
 * @description Obtiene un usuario por su ID.
 * @access Privado (Requiere 'administrador', 'tecnico' o el propio 'usuario' para ver su perfil)
 */
router.get(
    '/:id',
    verifyToken, // Requiere un token JWT válido
    // Aquí podrías añadir una lógica para que el usuario solo pueda ver su propio perfil
    // o que un admin/tecnico pueda ver cualquier perfil.
    // Por simplicidad, por ahora permitimos a 'administrador', 'tecnico' o 'usuario' (si es su propio ID)
    checkRole(['administrador', 'tecnico', 'usuario']),
    usuarioController.obtenerUsuarioPorId
);

/**
 * @route PUT /api/usuarios/:id
 * @description Actualiza un usuario existente por su ID.
 * @access Privado (Requiere 'administrador', o el propio 'usuario' para actualizar su perfil)
 */
router.put(
    '/:id',
    verifyToken, // Requiere un token JWT válido
    // Deberías añadir lógica para que un usuario solo pueda actualizar su propio perfil
    // o un admin pueda actualizar cualquier perfil.
    checkRole(['administrador', 'usuario']),
    updateUserValidationRules(), // Aplica las reglas de validación para la actualización
    validate, // Middleware para procesar los resultados de la validación
    usuarioController.actualizarUsuario
);

/**
 * @route DELETE /api/usuarios/:id
 * @description Elimina un usuario por su ID.
 * @access Privado (Requiere 'administrador')
 */
router.delete(
    '/:id',
    verifyToken, // Requiere un token JWT válido
    checkRole(['administrador']), // Solo administradores pueden eliminar usuarios
    usuarioController.eliminarUsuario
);

module.exports = router; // Exporta el enrutador
