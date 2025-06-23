/**
 * @file backend/models/Movimiento.js
 * @description Define el modelo de base de datos para la entidad Movimiento.
 * Registra los movimientos de equipos (asignaciones, reubicaciones, retiros, devoluciones).
 */

const { DataTypes } = require('sequelize');

/**
 * @function
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').Model} El modelo Movimiento definido.
 * @description Define el modelo Movimiento con sus atributos y opciones.
 */
module.exports = (sequelize) => {
  /**
   * @typedef {object} MovimientoAttributes
   * @property {number} id_movimiento - Identificador único del registro de movimiento (PK, auto-incrementable).
   * @property {Date} fecha_movimiento - Fecha en que se registró el movimiento.
   * @property {('asignacion'|'reubicacion'|'retiro'|'devolucion')} tipo_movimiento - Tipo de movimiento realizado.
   * @property {string} [observaciones] - Observaciones adicionales sobre el movimiento.
   * @property {number} id_equipo - FK: ID del equipo involucrado en el movimiento.
   * @property {number} [id_usuario_realiza_movimiento] - FK: ID del usuario que registró el movimiento (opcional).
   * @property {number} [id_usuario_anterior] - FK: ID del usuario al que estaba asignado el equipo antes del movimiento (opcional).
   * @property {number} [id_usuario_actual] - FK: ID del usuario al que está asignado el equipo después del movimiento (opcional).
   * @property {number} [id_ubicacion_anterior] - FK: ID de la ubicación anterior del equipo (opcional).
   * @property {number} [id_ubicacion_actual] - FK: ID de la ubicación actual del equipo (opcional).
   */
  const Movimiento = sequelize.define('Movimiento', {
    id_movimiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único del movimiento'
    },
    fecha_movimiento: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha en que se registró el movimiento'
    },
    tipo_movimiento: {
      type: DataTypes.ENUM('asignacion', 'reubicacion', 'retiro', 'devolucion'),
      allowNull: false,
      comment: 'Tipo de movimiento (asignacion, reubicacion, retiro, devolucion)'
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Observaciones adicionales sobre el movimiento'
    }
  }, {
    tableName: 'movimientos', // Nombre de la tabla en la base de datos
    timestamps: false // Deshabilita los campos 'createdAt' y 'updatedAt'
  });
  return Movimiento;
};