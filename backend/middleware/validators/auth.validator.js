    /**
     * @file backend/middleware/validators/auth.validator.js
     * @description Valida los datos de entrada para las rutas de autenticación,
     * alineado con la estructura de la tabla `usuarios` (campo `usuario` y `contraseña`).
     */

    const { body } = require('express-validator');

    // Reglas de validación para el inicio de sesión
    exports.loginValidationRules = () => {
      return [
        body('usuario') // Valida el campo `usuario` (nombre de usuario)
          .notEmpty().withMessage('El nombre de usuario es obligatorio.')
          .isString().withMessage('El nombre de usuario debe ser una cadena de texto.'),
        body('contraseña') // Valida el campo `contraseña` (con tilde)
          .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
      ];
    };
    