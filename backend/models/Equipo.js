/**
 * @file backend/models/Equipo.js
 * @description Define el modelo de base de datos para la entidad Equipo.
 * Representa los equipos individuales que forman parte del inventario.
 */

const { DataTypes } = require('sequelize');

/**
 * @function
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').Model} El modelo Equipo definido.
 * @description Define el modelo Equipo con sus atributos y opciones.
 */
module.exports = (sequelize) => {
  /**
   * @typedef {object} EquipoAttributes
   * @property {number} id_equipo - Identificador único del equipo (PK, auto-incrementable).
   * @property {string} nombre_equipo - Nombre descriptivo del equipo.
   * @property {string} numero_serie - Número de serie único del equipo.
   * @property {string} [modelo] - Modelo del equipo.
   * @property {string} [marca] - Marca del equipo.
   * @property {string} [descripcion] - Descripción detallada del equipo.
   * @property {Date} [fecha_adquisicion] - Fecha de adquisición del equipo.
   * @property {Date} [fecha_ultimo_mantenimiento] - Última fecha de mantenimiento del equipo.
   * @property {number} [costo_adquisicion] - Costo de adquisición del equipo.
   * @property {number} id_tipo_equipo - FK: ID del tipo de equipo al que pertenece.
   * @property {number} id_estado_equipo - FK: ID del estado actual del equipo.
   * @property {number} id_ubicacion - FK: ID de la ubicación actual del equipo.
   * @property {number} [id_usuario_asignado] - FK: ID del usuario al que está asignado el equipo (opcional).
   */
  const Equipo = sequelize.define('Equipo', {
    id_equipo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único del equipo'
    },
    nombre_equipo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nombre descriptivo del equipo'
    },
    numero_serie: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Número de serie único del equipo'
    },
    modelo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Modelo del equipo'
    },
    marca: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Marca del equipo'
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción detallada del equipo'
    },
    fecha_adquisicion: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha de adquisición del equipo'
    },
    fecha_ultimo_mantenimiento: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha del último mantenimiento realizado'
    },
    costo_adquisicion: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Costo de adquisición del equipo'
    }
  }, {
    tableName: 'equipos', // Nombre de la tabla en la base de datos
    timestamps: false // Deshabilita los campos 'createdAt' y 'updatedAt'
  });
  return Equipo;
};