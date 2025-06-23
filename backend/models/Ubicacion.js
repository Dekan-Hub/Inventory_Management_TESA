/**
 * @file Modelo de datos para la entidad 'Ubicacion'.
 * @description Representa la tabla 'ubicaciones' en la base de datos.
 * Define el esquema y las validaciones para las ubicaciones físicas de los equipos (ej. 'Oficina 101', 'Almacén Principal').
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Importa la instancia de Sequelize

const Ubicacion = sequelize.define('Ubicacion', {
  /**
   * @property {number} id - Identificador único de la ubicación.
   * Es la clave primaria y se auto-incrementa.
   */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * @property {string} nombre_ubicacion - Nombre de la ubicación.
   * Debe ser único y no puede estar vacío.
   */
  nombre_ubicacion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'Esta ubicación ya existe.'
    },
    validate: {
      notEmpty: {
        msg: 'El nombre de la ubicación no puede estar vacío.'
      }
    }
  },
  /**
   * @property {string} descripcion - Descripción opcional de la ubicación.
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
  tableName: 'ubicaciones', // Nombre explícito de la tabla en la DB
  timestamps: true // Habilita createdAt y updatedAt
});

module.exports = Ubicacion;