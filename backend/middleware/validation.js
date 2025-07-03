const { body, param, query, validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Errores de validación:', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

/**
 * Validaciones para autenticación
 */
const authValidations = {
  login: [
    body('email')
      .isEmail()
      .withMessage('El email debe ser válido')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    handleValidationErrors
  ],
  
  register: [
    body('nombre')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    body('apellido')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('El apellido debe tener entre 2 y 50 caracteres'),
    body('email')
      .isEmail()
      .withMessage('El email debe ser válido')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
    body('rol')
      .optional()
      .isIn(['admin', 'tecnico', 'usuario'])
      .withMessage('El rol debe ser admin, tecnico o usuario'),
    handleValidationErrors
  ]
};

/**
 * Validaciones para equipos
 */
const equiposValidations = {
  create: [
    body('codigo')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('El código debe tener entre 3 y 20 caracteres')
      .matches(/^[A-Z0-9-]+$/)
      .withMessage('El código solo puede contener letras mayúsculas, números y guiones'),
    body('nombre')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
    body('marca')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('La marca debe tener entre 2 y 50 caracteres'),
    body('modelo')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('El modelo debe tener entre 2 y 50 caracteres'),
    body('tipo_equipo_id')
      .isInt({ min: 1 })
      .withMessage('El tipo de equipo es requerido'),
    body('estado_equipo_id')
      .isInt({ min: 1 })
      .withMessage('El estado del equipo es requerido'),
    body('ubicacion_id')
      .isInt({ min: 1 })
      .withMessage('La ubicación es requerida'),
    body('fecha_adquisicion')
      .optional()
      .isISO8601()
      .withMessage('La fecha de adquisición debe ser válida'),
    body('valor_adquisicion')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('El valor de adquisición debe ser un número positivo'),
    handleValidationErrors
  ],
  
  update: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID de equipo inválido'),
    body('codigo')
      .optional()
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('El código debe tener entre 3 y 20 caracteres')
      .matches(/^[A-Z0-9-]+$/)
      .withMessage('El código solo puede contener letras mayúsculas, números y guiones'),
    body('nombre')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
    body('marca')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('La marca debe tener entre 2 y 50 caracteres'),
    body('modelo')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('El modelo debe tener entre 2 y 50 caracteres'),
    body('tipo_equipo_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El tipo de equipo debe ser válido'),
    body('estado_equipo_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El estado del equipo debe ser válido'),
    body('ubicacion_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La ubicación debe ser válida'),
    handleValidationErrors
  ],
  
  getById: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID de equipo inválido'),
    handleValidationErrors
  ],
  
  delete: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID de equipo inválido'),
    handleValidationErrors
  ]
};

/**
 * Validaciones para mantenimientos
 */
const mantenimientosValidations = {
  create: [
    body('equipo_id')
      .isInt({ min: 1 })
      .withMessage('El equipo es requerido'),
    body('tipo_mantenimiento')
      .isIn(['preventivo', 'correctivo', 'predictivo'])
      .withMessage('El tipo de mantenimiento debe ser preventivo, correctivo o predictivo'),
    body('descripcion')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
    body('fecha_mantenimiento')
      .optional()
      .isISO8601()
      .withMessage('La fecha de mantenimiento debe ser válida'),
    body('costo')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('El costo debe ser un número positivo'),
    body('estado')
      .optional()
      .isIn(['programado', 'en_proceso', 'completado', 'cancelado'])
      .withMessage('El estado debe ser programado, en_proceso, completado o cancelado'),
    handleValidationErrors
  ],
  
  update: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID de mantenimiento inválido'),
    body('tipo_mantenimiento')
      .optional()
      .isIn(['preventivo', 'correctivo', 'predictivo'])
      .withMessage('El tipo de mantenimiento debe ser preventivo, correctivo o predictivo'),
    body('descripcion')
      .optional()
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
    body('estado')
      .optional()
      .isIn(['programado', 'en_proceso', 'completado', 'cancelado'])
      .withMessage('El estado debe ser programado, en_proceso, completado o cancelado'),
    handleValidationErrors
  ]
};

/**
 * Validaciones para movimientos
 */
const movimientosValidations = {
  create: [
    body('equipo_id')
      .isInt({ min: 1 })
      .withMessage('El equipo es requerido'),
    body('ubicacion_origen_id')
      .isInt({ min: 1 })
      .withMessage('La ubicación origen es requerida'),
    body('ubicacion_destino_id')
      .isInt({ min: 1 })
      .withMessage('La ubicación destino es requerida'),
    body('motivo')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('El motivo debe tener entre 5 y 200 caracteres'),
    body('observaciones')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Las observaciones no pueden exceder 500 caracteres'),
    handleValidationErrors
  ]
};

/**
 * Validaciones para solicitudes
 */
const solicitudesValidations = {
  create: [
    body('equipo_id')
      .isInt({ min: 1 })
      .withMessage('El equipo es requerido'),
    body('tipo')
      .isIn(['prestamo', 'reparacion', 'mantenimiento', 'otro'])
      .withMessage('El tipo debe ser prestamo, reparacion, mantenimiento u otro'),
    body('descripcion')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
    handleValidationErrors
  ]
};

/**
 * Validaciones para alertas
 */
const alertasValidations = {
  create: [
    body('equipo_id')
      .isInt({ min: 1 })
      .withMessage('El equipo es requerido'),
    body('tipo')
      .isIn(['mantenimiento', 'reparacion', 'obsoleto', 'seguridad', 'otro'])
      .withMessage('El tipo debe ser mantenimiento, reparacion, obsoleto, seguridad u otro'),
    body('mensaje')
      .trim()
      .isLength({ min: 10, max: 300 })
      .withMessage('El mensaje debe tener entre 10 y 300 caracteres'),
    body('prioridad')
      .optional()
      .isIn(['baja', 'media', 'alta', 'critica'])
      .withMessage('La prioridad debe ser baja, media, alta o critica'),
    handleValidationErrors
  ]
};

/**
 * Validaciones para usuarios
 */
const usuariosValidations = {
  create: [
    body('nombre')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    body('apellido')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('El apellido debe tener entre 2 y 50 caracteres'),
    body('email')
      .isEmail()
      .withMessage('El email debe ser válido')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
    body('rol')
      .optional()
      .isIn(['admin', 'tecnico', 'usuario'])
      .withMessage('El rol debe ser admin, tecnico o usuario'),
    handleValidationErrors
  ],
  
  update: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID de usuario inválido'),
    body('nombre')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    body('apellido')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('El apellido debe tener entre 2 y 50 caracteres'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('El email debe ser válido')
      .normalizeEmail(),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
    handleValidationErrors
  ]
};

/**
 * Validaciones para paginación y filtros
 */
const paginationValidations = {
  list: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La página debe ser un número positivo'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('El límite debe estar entre 1 y 100'),
    handleValidationErrors
  ]
};

module.exports = {
  authValidations,
  equiposValidations,
  mantenimientosValidations,
  movimientosValidations,
  solicitudesValidations,
  alertasValidations,
  usuariosValidations,
  paginationValidations,
  handleValidationErrors
}; 