/**
 * @file Modelo de datos para la entidad 'Mantenimiento'.
 * @description Representa la tabla 'mantenimientos' en la base de datos.
 * Define el esquema, validaciones y asociaciones con Equipo y Usuario (el técnico).
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Importa la instancia de Sequelize

// Importa los modelos relacionados para definir las asociaciones
const Equipo = require('./Equipo');
const Usuario = require('./Usuario');

const Mantenimiento = sequelize.define('Mantenimiento', {
  /**
   * @property {number} id - Identificador único del registro de mantenimiento.
   * Es la clave primaria y se auto-incrementa.
   */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * @property {string} fecha_mantenimiento - Fecha en que se realizó el mantenimiento.
   * Solo almacena la fecha (YYYY-MM-DD). No puede ser nula.
   */
  fecha_mantenimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  /**
   * @property {string} descripcion - Descripción detallada del trabajo de mantenimiento realizado.
   * No puede ser nula o vacía.
   */
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La descripción del mantenimiento no puede estar vacía.'
      }
    }
  },
  /**
   * @property {number} costo - Costo asociado al mantenimiento.
   * Puede ser nulo si no hay costo. Es un número decimal con hasta 2 decimales.
   * El valor por defecto es 0.00 y no puede ser negativo.
   */
  costo: {
    type: DataTypes.DECIMAL(10, 2), // Permite valores hasta 99,999,999.99
    allowNull: true,
    defaultValue: 0.00,
    validate: {
      isDecimal: {
        msg: 'El costo debe ser un número decimal.'
      },
      min: {
        args: [0],
        msg: 'El costo no puede ser negativo.'
      }
    }
  },
  /**
   * @property {number} id_equipo - Clave foránea que referencia el ID del Equipo al que se le realizó el mantenimiento.
   * No puede ser nula, cada mantenimiento debe estar asociado a un equipo.
   */
  id_equipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { // Define la relación con la tabla 'equipos'
      model: Equipo,
      key: 'id'
    }
  },
  /**
   * @property {number} id_tecnico - Clave foránea que referencia el ID del Usuario (técnico) que realizó el mantenimiento.
   * No puede ser nula, cada mantenimiento debe tener un técnico asociado.
   */
  id_tecnico: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { // Define la relación con la tabla 'usuarios'
      model: Usuario,
      key: 'id'
    }
  }
}, {
  /**
   * @property {object} options - Opciones de configuración para el modelo Sequelize.
   * @property {string} options.tableName - Nombre de la tabla en la base de datos.
   * @property {boolean} options.timestamps - Habilita las columnas `createdAt` y `updatedAt`.
   */
  tableName: 'mantenimientos', // Nombre explícito de la tabla en la DB
  timestamps: true // Habilita createdAt y updatedAt
});

// --- Definición de Asociaciones a nivel de modelo ---
/**
 * @description Define que un Mantenimiento pertenece a un Equipo.
 * La clave foránea es `id_equipo`. El alias para la relación es 'equipo'.
 */
Mantenimiento.belongsTo(Equipo, { foreignKey: 'id_equipo', as: 'equipo' });
/**
 * @description Define que un Mantenimiento fue realizado por un Usuario (técnico).
 * La clave foránea es `id_tecnico`. El alias para la relación es 'tecnico'.
 */
Mantenimiento.belongsTo(Usuario, { foreignKey: 'id_tecnico', as: 'tecnico' });

module.exports = Mantenimiento;