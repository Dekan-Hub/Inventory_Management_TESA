/**
 * @file Modelo de datos para la entidad 'EstadoEquipo'.
 * @description Representa la tabla 'estado_equipos' en la base de datos.
 * Define el esquema y las validaciones para los diferentes estados en que puede estar un equipo (ej. 'Operativo', 'En Mantenimiento').
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Importa la instancia de Sequelize

const EstadoEquipo = sequelize.define('EstadoEquipo', {
  /**
   * @property {number} id - Identificador único del estado del equipo.
   * Es la clave primaria y se auto-incrementa.
   */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * @property {string} nombre_estado - Nombre del estado del equipo.
   * Debe ser único y no puede estar vacío.
   */
  nombre_estado: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      msg: 'Este estado de equipo ya existe.'
    },
    validate: {
      notEmpty: {
        msg: 'El nombre del estado no puede estar vacío.'
      }
    }
  },
  /**
   * @property {string} descripcion - Descripción opcional del estado del equipo.
   * Puede ser nulo.
   */
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  /**
   * @property {object} options - Opciones de configuración para el modelo Sequelize.
   * @property {string} options.tableName - Nombre de la tabla en la base de datos.
   * @property {boolean} options.timestamps - Habilita las columnas `createdAt` y `updatedAt`.
   */
  tableName: 'estado_equipos', // Nombre explícito de la tabla en la DB
  timestamps: true // Habilita createdAt y updatedAt
});

module.exports = EstadoEquipo; // Exporta el modelo para su uso en otras partes de la aplicación