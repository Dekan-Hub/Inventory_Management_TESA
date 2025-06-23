/**
 * @file backend/models/Mantenimiento.js
 * @description Define el modelo de base de datos para la entidad Mantenimiento.
 * Registra los mantenimientos realizados a los equipos.
 */

const { DataTypes } = require('sequelize');

/**
 * @function
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').Model} El modelo Mantenimiento definido.
 * @description Define el modelo Mantenimiento con sus atributos y opciones.
 */
module.exports = (sequelize) => {
  /**
   * @typedef {object} MantenimientoAttributes
   * @property {number} id_mantenimiento - Identificador único del registro de mantenimiento (PK, auto-incrementable).
   * @property {Date} fecha_mantenimiento - Fecha en que se realizó el mantenimiento.
   * @property {string} [descripcion_problema] - Descripción del problema que motivó el mantenimiento.
   * @property {string} [solucion_aplicada] - Descripción de la solución aplicada.
   * @property {number} [costo_mantenimiento] - Costo asociado al mantenimiento.
   * @property {number} id_equipo - FK: ID del equipo al que se le realizó el mantenimiento.
   * @property {number} id_tecnico - FK: ID del usuario (técnico) que realizó el mantenimiento.
   */
  const Mantenimiento = sequelize.define('Mantenimiento', {
    id_mantenimiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único del mantenimiento'
    },
    fecha_mantenimiento: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha en que se realizó el mantenimiento'
    },
    descripcion_problema: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción del problema reportado'
    },
    solucion_aplicada: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Detalles de la solución aplicada'
    },
    costo_mantenimiento: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Costo total del mantenimiento'
    }
  }, {
    tableName: 'mantenimientos', // Nombre de la tabla en la base de datos
    timestamps: false // Deshabilita los campos 'createdAt' y 'updatedAt'
  });
  return Mantenimiento;
};