/**
 * @file Modelo de datos para la entidad 'Alerta'.
 * @description Representa la tabla 'alertas' en la base de datos.
 * Define el esquema para las notificaciones internas del sistema.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Importa la instancia de Sequelize
const Usuario = require('./Usuario'); // Importa el modelo Usuario para la asociación

const Alerta = sequelize.define('Alerta', {
  /**
   * @property {number} id - Identificador único de la alerta.
   * Es la clave primaria y se auto-incrementa.
   */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * @property {string} tipo_alerta - Tipo o categoría de la alerta (ej. 'Mantenimiento', 'Baja', 'Stock bajo').
   * No puede ser nulo o vacío.
   */
  tipo_alerta: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El tipo de alerta no puede estar vacío.'
      }
    }
  },
  /**
   * @property {string} mensaje - Contenido del mensaje de la alerta.
   * No puede ser nulo o vacío.
   */
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El mensaje de la alerta no puede estar vacío.'
      }
    }
  },
  /**
   * @property {boolean} leida - Indica si la alerta ha sido leída por el usuario.
   * Por defecto es false (no leída).
   */
  leida: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  /**
   * @property {number} id_usuario_destino - Clave foránea que referencia al Usuario al que va dirigida la alerta.
   * Puede ser nulo si la alerta es para todos los usuarios o un rol específico (manejar en lógica).
   */
  id_usuario_destino: {
    type: DataTypes.INTEGER,
    allowNull: true, // Puede ser nulo si es una alerta general
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
  tableName: 'alertas', // Nombre explícito de la tabla en la DB
  timestamps: true // Habilita createdAt y updatedAt
});

// --- Definición de Asociaciones a nivel de modelo ---
/**
 * @description Define que una Alerta pertenece a un Usuario (su destinatario).
 * La clave foránea es `id_usuario_destino`. El alias para la relación es 'destinatario'.
 */
Alerta.belongsTo(Usuario, { foreignKey: 'id_usuario_destino', as: 'destinatario' });

module.exports = Alerta;