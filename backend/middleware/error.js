/**
 * @file Middleware para el manejo centralizado de errores en la aplicación Express.
 * @description Captura errores que ocurren en las rutas o middlewares previos,
 * formatea la respuesta de error y la envía al cliente. Distingue entre errores
 * operacionales y errores de programación para evitar exponer información sensible.
 */

/**
 * Middleware para manejar errores.
 * @function errorHandler
 * @param {Error} err - El objeto de error.
 * @param {object} req - Objeto de la petición (request).
 * @param {object} res - Objeto de la respuesta (response).
 * @param {function} next - Función para pasar el control al siguiente middleware.
 * @returns {object} Respuesta JSON con detalles del error.
 */
const errorHandler = (err, req, res, next) => {
  // Determina el código de estado HTTP del error.
  // Si el error tiene un `statusCode` definido, úsalo; de lo contrario, 500 (Error Interno del Servidor).
  const statusCode = err.statusCode || 500;

  // Crea un objeto de error para enviar al cliente.
  // En producción, evita enviar el stack trace completo por seguridad.
  const errorResponse = {
    status: 'error',
    message: err.message || 'Ha ocurrido un error inesperado.',
  };

  // En entorno de desarrollo, añade el stack trace para facilitar la depuración.
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Registra el error en la consola del servidor (siempre es útil para la depuración).
  console.error(`🚨 Error [${statusCode}]:`, err.message);
  if (process.env.NODE_ENV === 'development' && err.stack) {
    console.error(err.stack);
  }

  // Envía la respuesta de error al cliente.
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;