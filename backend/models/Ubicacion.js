/**
 * @file backend/models/Ubicacion.js
 * @description Define el modelo de base de datos para la entidad Ubicacion.
 * Representa las ubicaciones físicas donde pueden encontrarse los equipos.
 */

const { DataTypes } = require('sequelize');

/**
 * @function
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').Model} El modelo Ubicacion definido.
 * @description Define el modelo Ubicacion con sus atributos y opciones.
 */
module.exports = (sequelize) => {
  /**
   * @typedef {object} UbicacionAttributes
   * @property {number} id_ubicacion - Identificador único de la ubicación (PK, auto-incrementable).
   * @property {string} nombre_ubicacion - Nombre único de la ubicación (ej. "Oficina Principal", "Almacén A").
   * @property {string} [direccion] - Dirección física de la ubicación.
   * @property {string} [descripcion] - Descripción opcional de la ubicación.
   */
  const Ubicacion = sequelize.define('Ubicacion', {
    id_ubicacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único de la ubicación'
    },
    nombre_ubicacion: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Nombre único de la ubicación'
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Dirección física de la ubicación'
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción de la ubicación'
    }
  }, {
    tableName: 'ubicaciones', // Nombre de la tabla en la base de datos
    timestamps: false // Deshabilita los campos 'createdAt' y 'updatedAt'
  });
  return Ubicacion;
};