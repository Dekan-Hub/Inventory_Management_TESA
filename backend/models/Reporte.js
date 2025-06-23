/**
 * @file backend/models/Reporte.js
 * @description Define el modelo de base de datos para la entidad Reporte.
 * Almacena información sobre los reportes generados en el sistema.
 */

const { DataTypes } = require('sequelize');

/**
 * @function
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').Model} El modelo Reporte definido.
 * @description Define el modelo Reporte con sus atributos y opciones.
 */
module.exports = (sequelize) => {
  /**
   * @typedef {object} ReporteAttributes
   * @property {number} id_reporte - Identificador único del reporte (PK, auto-incrementable).
   * @property {string} tipo_reporte - Tipo de reporte (ej. "Inventario Actual", "Mantenimientos por Fecha").
   * @property {Date} fecha_generacion - Fecha y hora de generación del reporte.
   * @property {object} [datos_json] - Datos estructurados del reporte en formato JSON (opcional).
   * @property {number} id_usuario_genera - FK: ID del usuario que generó el reporte.
   */
  const Reporte = sequelize.define('Reporte', {
    id_reporte: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único del reporte'
    },
    tipo_reporte: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Tipo de reporte generado'
    },
    fecha_generacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha y hora de generación del reporte'
    },
    datos_json: {
      type: DataTypes.JSON, // Utiliza JSON para almacenar datos estructurados flexibles
      allowNull: true,
      comment: 'Datos del reporte en formato JSON'
    }
  }, {
    tableName: 'reportes', // Nombre de la tabla en la base de datos
    timestamps: false // Deshabilita los campos 'createdAt' y 'updatedAt'
  });
  return Reporte;
};