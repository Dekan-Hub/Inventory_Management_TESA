/**
 * @file backend/models/EstadoEquipo.js
 * @description Define el modelo de base de datos para la entidad EstadoEquipo.
 * Representa los posibles estados en los que puede encontrarse un equipo.
 */

const { DataTypes } = require('sequelize');

/**
 * @function
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').Model} El modelo EstadoEquipo definido.
 * @description Define el modelo EstadoEquipo con sus atributos y opciones.
 */
module.exports = (sequelize) => {
  /**
   * @typedef {object} EstadoEquipoAttributes
   * @property {number} id_estado_equipo - Identificador único del estado del equipo (PK, auto-incrementable).
   * @property {string} nombre_estado - Nombre único del estado (ej. "Operativo", "En Mantenimiento", "De Baja").
   * @property {string} [descripcion] - Descripción opcional del estado.
   */
  const EstadoEquipo = sequelize.define('EstadoEquipo', {
    id_estado_equipo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único del estado del equipo'
    },
    nombre_estado: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Nombre único del estado del equipo'
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción del estado del equipo'
    }
  }, {
    tableName: 'estados_equipo', // Nombre de la tabla en la base de datos
    timestamps: false // Deshabilita los campos 'createdAt' y 'updatedAt'
  });
  return EstadoEquipo;
};