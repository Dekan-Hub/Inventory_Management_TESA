/**
 * @file Modelo de datos para la entidad 'TipoEquipo'.
 * @description Representa la tabla 'tipo_equipos' en la base de datos.
 * Define el esquema y las validaciones para los tipos de equipos (ej. 'Laptop', 'Monitor').
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Importa la instancia de Sequelize

const TipoEquipo = sequelize.define('TipoEquipo', {
  /**
   * @property {number} id - Identificador único del tipo de equipo.
   * Es la clave primaria y se auto-incrementa.
   */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * @property {string} nombre_tipo - Nombre del tipo de equipo.
   * Debe ser único y no puede estar vacío.
   */
  nombre_tipo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'Este tipo de equipo ya existe.'
    },
    validate: {
      notEmpty: {
        msg: 'El nombre del tipo de equipo no puede estar vacío.'
      }
    }
  },
  /**
   * @property {string} descripcion - Descripción opcional del tipo de equipo.
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
  tableName: 'tipo_equipos', // Nombre explícito de la tabla en la DB
  timestamps: true // Habilita createdAt y updatedAt
});

module.exports = TipoEquipo; // Exporta el modelo para su uso en otros archivos