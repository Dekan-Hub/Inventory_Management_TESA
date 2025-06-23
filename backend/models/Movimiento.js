/**
 * @file Modelo de datos para la entidad 'Movimiento'.
 * @description Representa la tabla 'movimientos' en la base de datos.
 * Registra los cambios de ubicación o asignación de un equipo, incluyendo
 * quién realizó el movimiento y la fecha.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Importa la instancia de Sequelize

// Importa los modelos relacionados para definir las asociaciones
const Equipo = require('./Equipo');
const Usuario = require('./Usuario'); // Para el usuario que realiza el movimiento y el usuario asignado
const Ubicacion = require('./Ubicacion'); // Para la nueva ubicación

const Movimiento = sequelize.define('Movimiento', { // <-- Nombre del modelo 'Movimiento'
  /**
   * @property {number} id - Identificador único del registro de movimiento.
   * Es la clave primaria y se auto-incrementa.
   */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * @property {string} tipo_movimiento - Tipo de movimiento (ej. 'Asignación', 'Reubicación', 'Desasignación', 'Baja').
   * No puede ser nulo o vacío.
   */
  tipo_movimiento: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El tipo de movimiento no puede estar vacío.'
      }
    }
  },
  /**
   * @property {string} fecha_movimiento - Fecha en que se realizó el movimiento.
   * Solo almacena la fecha (YYYY-MM-DD). No puede ser nula.
   */
  fecha_movimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  /**
   * @property {string} observaciones - Observaciones adicionales sobre el movimiento.
   * Puede ser nulo.
   */
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // --- Claves Foráneas ---
  /**
   * @property {number} id_equipo - Clave foránea que referencia el ID del Equipo movido.
   * No puede ser nulo, cada movimiento debe estar asociado a un equipo.
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
   * @property {number} id_usuario_anterior - Clave foránea que referencia el ID del Usuario anterior del equipo.
   * Puede ser nulo si no había un usuario anterior.
   */
  id_usuario_anterior: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { // Define la relación con la tabla 'usuarios'
      model: Usuario,
      key: 'id'
    }
  },
  /**
   * @property {number} id_usuario_actual - Clave foránea que referencia el ID del Usuario actual del equipo.
   * Puede ser nulo si el equipo ya no está asignado a un usuario.
   */
  id_usuario_actual: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { // Define la relación con la tabla 'usuarios'
      model: Usuario,
      key: 'id'
    }
  },
  /**
   * @property {number} id_ubicacion_anterior - Clave foránea que referencia el ID de la Ubicación anterior del equipo.
   * Puede ser nulo si no había una ubicación anterior (ej. recién dado de alta).
   */
  id_ubicacion_anterior: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { // Define la relación con la tabla 'ubicaciones'
      model: Ubicacion,
      key: 'id'
    }
  },
  /**
   * @property {number} id_ubicacion_actual - Clave foránea que referencia el ID de la Ubicación actual del equipo.
   * Puede ser nulo si el equipo fue dado de baja sin una ubicación final.
   */
  id_ubicacion_actual: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { // Define la relación con la tabla 'ubicaciones'
      model: Ubicacion,
      key: 'id'
    }
  },
  /**
   * @property {number} id_usuario_realiza_movimiento - Clave foránea que referencia el ID del Usuario que realizó este movimiento.
   * No puede ser nulo.
   */
  id_usuario_realiza_movimiento: {
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
  tableName: 'movimientos', // <-- Nombre explícito de la tabla 'movimientos'
  timestamps: true
});

// --- Definición de Asociaciones a nivel de modelo ---
/**
 * @description Define que un Movimiento pertenece a un Equipo.
 * La clave foránea es `id_equipo`. El alias para la relación es 'equipo'.
 */
Movimiento.belongsTo(Equipo, { foreignKey: 'id_equipo', as: 'equipo' });

/**
 * @description Define que un Movimiento tiene un Usuario anterior (opcional).
 * La clave foránea es `id_usuario_anterior`. El alias para la relación es 'usuarioAnterior'.
 */
Movimiento.belongsTo(Usuario, { foreignKey: 'id_usuario_anterior', as: 'usuarioAnterior' });

/**
 * @description Define que un Movimiento tiene un Usuario actual (opcional).
 * La clave foránea es `id_usuario_actual`. El alias para la relación es 'usuarioActual'.
 */
Movimiento.belongsTo(Usuario, { foreignKey: 'id_usuario_actual', as: 'usuarioActual' });

/**
 * @description Define que un Movimiento tiene una Ubicación anterior (opcional).
 * La clave foránea es `id_ubicacion_anterior`. El alias para la relación es 'ubicacionAnterior'.
 */
Movimiento.belongsTo(Ubicacion, { foreignKey: 'id_ubicacion_anterior', as: 'ubicacionAnterior' });

/**
 * @description Define que un Movimiento tiene una Ubicación actual (opcional).
 * La clave foránea es `id_ubicacion_actual`. El alias para la relación es 'ubicacionActual'.
 */
Movimiento.belongsTo(Ubicacion, { foreignKey: 'id_ubicacion_actual', as: 'ubicacionActual' });

/**
 * @description Define que un Movimiento fue realizado por un Usuario.
 * La clave foránea es `id_usuario_realiza_movimiento`. El alias para la relación es 'usuarioRealizaMovimiento'.
 */
Movimiento.belongsTo(Usuario, { foreignKey: 'id_usuario_realiza_movimiento', as: 'usuarioRealizaMovimiento' });

module.exports = Movimiento;