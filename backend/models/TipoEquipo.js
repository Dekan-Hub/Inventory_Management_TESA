/**
 * @file backend/models/TipoEquipo.js
 * @description Define el modelo de base de datos para la entidad TipoEquipo.
 * Representa los diferentes tipos de equipos en el inventario.
 */

const { DataTypes } = require('sequelize');

/**
 * @function
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').Model} El modelo TipoEquipo definido.
 * @description Define el modelo TipoEquipo con sus atributos y opciones.
 */
module.exports = (sequelize) => {
  /**
   * @typedef {object} TipoEquipoAttributes
   * @property {number} id_tipo_equipo - Identificador único del tipo de equipo (PK, auto-incrementable).
   * @property {string} nombre_tipo - Nombre único del tipo de equipo (ej. "Portátil", "Impresora").
   * @property {string} [descripcion] - Descripción opcional del tipo de equipo.
   */
  const TipoEquipo = sequelize.define('TipoEquipo', {
    id_tipo_equipo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único del tipo de equipo'
    },
    nombre_tipo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Nombre único del tipo de equipo'
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción del tipo de equipo'
    }
  }, {
    tableName: 'tipos_equipo', // Nombre de la tabla en la base de datos
    timestamps: false // Deshabilita los campos 'createdAt' y 'updatedAt'
  });
  return TipoEquipo;
};