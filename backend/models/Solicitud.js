/**
 * @file backend/models/Solicitud.js
 * @description Define el modelo de base de datos para la entidad Solicitud.
 * Representa las solicitudes de los usuarios relacionadas con los equipos.
 */

const { DataTypes } = require('sequelize');

/**
 * @function
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').Model} El modelo Solicitud definido.
 * @description Define el modelo Solicitud con sus atributos y opciones.
 */
module.exports = (sequelize) => {
  /**
   * @typedef {object} SolicitudAttributes
   * @property {number} id_solicitud - Identificador único de la solicitud (PK, auto-incrementable).
   * @property {('nuevo_equipo'|'mantenimiento'|'reubicacion'|'retiro')} tipo_solicitud - Tipo de solicitud realizada.
   * @property {string} descripcion - Descripción detallada de la solicitud.
   * @property {('pendiente'|'en_proceso'|'completada'|'rechazada')} estado_solicitud - Estado actual de la solicitud.
   * @property {Date} fecha_solicitud - Fecha y hora en que se realizó la solicitud.
   * @property {Date} [fecha_resolucion] - Fecha y hora de resolución de la solicitud (opcional).
   * @property {string} [observaciones_resolutor] - Observaciones añadidas por el usuario que resolvió la solicitud (opcional).
   * @property {number} id_usuario_solicitante - FK: ID del usuario que creó la solicitud.
   * @property {number} [id_usuario_resolutor] - FK: ID del usuario que resolvió la solicitud (opcional).
   * @property {number} [id_equipo_solicitado] - FK: ID del equipo al que hace referencia la solicitud (opcional).
   */
  const Solicitud = sequelize.define('Solicitud', {
    id_solicitud: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único de la solicitud'
    },
    tipo_solicitud: {
      type: DataTypes.ENUM('nuevo_equipo', 'mantenimiento', 'reubicacion', 'retiro'),
      allowNull: false,
      comment: 'Tipo de solicitud (nuevo_equipo, mantenimiento, reubicacion, retiro)'
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Descripción detallada de la solicitud'
    },
    estado_solicitud: {
      type: DataTypes.ENUM('pendiente', 'en_proceso', 'completada', 'rechazada'),
      allowNull: false,
      defaultValue: 'pendiente',
      comment: 'Estado actual de la solicitud'
    },
    fecha_solicitud: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha y hora en que se realizó la solicitud'
    },
    fecha_resolucion: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha y hora de resolución de la solicitud'
    },
    observaciones_resolutor: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Observaciones del resolutor de la solicitud'
    }
  }, {
    tableName: 'solicitudes', // Nombre de la tabla en la base de datos
    timestamps: false // Deshabilita los campos 'createdAt' y 'updatedAt'
  });
  return Solicitud;
};