/**
 * @file Modelo de datos para la entidad 'Solicitud'.
 * @description Representa la tabla 'solicitudes' en la base de datos.
 * Gestiona las solicitudes de equipos por parte de los usuarios.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Importa la instancia de Sequelize
const Usuario = require('./Usuario'); // Importa el modelo Usuario
const Equipo = require('./Equipo'); // Importa el modelo Equipo (opcional, si se solicita un equipo específico)

const Solicitud = sequelize.define('Solicitud', {
  /**
   * @property {number} id - Identificador único de la solicitud.
   * Es la clave primaria y se auto-incrementa.
   */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * @property {string} tipo_solicitud - Tipo de solicitud (ej. 'Asignación', 'Reemplazo', 'Mantenimiento').
   * No puede ser nulo o vacío.
   */
  tipo_solicitud: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El tipo de solicitud no puede estar vacío.'
      }
    }
  },
  /**
   * @property {string} descripcion_solicitud - Descripción detallada o motivo de la solicitud.
   * No puede ser nulo o vacío.
   */
  descripcion_solicitud: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La descripción de la solicitud no puede estar vacía.'
      }
    }
  },
  /**
   * @property {string} estado_solicitud - Estado actual de la solicitud (ej. 'Pendiente', 'Aprobada', 'Rechazada', 'Completada').
   * Valor por defecto: 'Pendiente'.
   */
  estado_solicitud: {
    type: DataTypes.ENUM('Pendiente', 'Aprobada', 'Rechazada', 'Completada'),
    allowNull: false,
    defaultValue: 'Pendiente'
  },
  /**
   * @property {string} fecha_solicitud - Fecha en que se realizó la solicitud.
   * Solo almacena la fecha (YYYY-MM-DD). No puede ser nula.
   */
  fecha_solicitud: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW // Por defecto, la fecha actual al crearse
  },
  /**
   * @property {string} fecha_resolucion - Fecha en que la solicitud fue resuelta (aprobada/rechazada/completada).
   * Puede ser nula hasta que la solicitud se resuelva.
   */
  fecha_resolucion: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  /**
   * @property {string} comentarios_admin - Comentarios adicionales del administrador o técnico sobre la resolución.
   * Puede ser nulo.
   */
  comentarios_admin: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // --- Claves Foráneas ---
  /**
   * @property {number} id_usuario_solicitante - Clave foránea que referencia al Usuario que realiza la solicitud.
   * No puede ser nulo.
   */
  id_usuario_solicitante: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { // Define la relación con la tabla 'usuarios'
      model: Usuario,
      key: 'id'
    }
  },
  /**
   * @property {number} id_equipo_solicitado - Clave foránea que referencia al Equipo específico solicitado (opcional).
   * Puede ser nulo si la solicitud es para un tipo de equipo o una necesidad genérica.
   */
  id_equipo_solicitado: {
    type: DataTypes.INTEGER,
    allowNull: true, // Puede ser nulo
    references: { // Define la relación con la tabla 'equipos'
      model: Equipo,
      key: 'id'
    }
  },
  /**
   * @property {number} id_usuario_resolutor - Clave foránea que referencia al Usuario (administrador/técnico) que resuelve la solicitud.
   * Puede ser nulo hasta que la solicitud sea resuelta.
   */
  id_usuario_resolutor: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  tableName: 'solicitudes', // Nombre explícito de la tabla en la DB
  timestamps: true // Habilita createdAt y updatedAt
});

// --- Definición de Asociaciones a nivel de modelo ---
/**
 * @description Define que una Solicitud pertenece a un Usuario (el solicitante).
 * La clave foránea es `id_usuario_solicitante`. El alias para la relación es 'solicitante'.
 */
Solicitud.belongsTo(Usuario, { foreignKey: 'id_usuario_solicitante', as: 'solicitante' });

/**
 * @description Define que una Solicitud puede estar asociada a un Equipo específico (opcional).
 * La clave foránea es `id_equipo_solicitado`. El alias para la relación es 'equipoSolicitado'.
 */
Solicitud.belongsTo(Equipo, { foreignKey: 'id_equipo_solicitado', as: 'equipoSolicitado' });

/**
 * @description Define que una Solicitud puede ser resuelta por un Usuario (el resolutor, opcional).
 * La clave foránea es `id_usuario_resolutor`. El alias para la relación es 'resolutor'.
 */
Solicitud.belongsTo(Usuario, { foreignKey: 'id_usuario_resolutor', as: 'resolutor' });

module.exports = Solicitud;