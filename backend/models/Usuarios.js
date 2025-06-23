/**
 * @file backend/models/Usuario.js
 * @description Define el modelo de base de datos para la entidad Usuario.
 * Representa a los usuarios del sistema de gestión de inventario.
 */

const { DataTypes } = require('sequelize');

/**
 * @function
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').Model} El modelo Usuario definido.
 * @description Define el modelo Usuario con sus atributos y opciones.
 */
module.exports = (sequelize) => {
  /**
   * @typedef {object} UsuarioAttributes
   * @property {number} id_usuario - Identificador único del usuario (PK, auto-incrementable).
   * @property {string} nombre_usuario - Nombre de usuario único para inicio de sesión.
   * @property {string} contrasena_hash - Hash seguro de la contraseña del usuario.
   * @property {('administrador'|'empleado'|'tecnico')} rol - Rol del usuario en el sistema.
   * @property {string} correo_electronico - Correo electrónico único del usuario.
   * @property {boolean} estado_activo - Indica si la cuenta del usuario está activa o deshabilitada.
   * @property {Date} fecha_creacion - Fecha y hora de creación de la cuenta del usuario.
   * @property {Date} [ultima_conexion] - Última fecha y hora de conexión del usuario (opcional).
   */
  const Usuario = sequelize.define('Usuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único del usuario'
    },
    nombre_usuario: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Nombre de usuario único'
    },
    contrasena_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Hash seguro de la contraseña'
    },
    rol: {
      type: DataTypes.ENUM('administrador', 'empleado', 'tecnico'),
      allowNull: false,
      defaultValue: 'empleado',
      comment: 'Rol del usuario (administrador, empleado, tecnico)'
    },
    correo_electronico: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Correo electrónico único del usuario'
    },
    estado_activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Estado de la cuenta (activo/inactivo)'
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha de creación del usuario'
    },
    ultima_conexion: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha de la última conexión del usuario'
    }
  }, {
    tableName: 'usuarios', // Nombre de la tabla en la base de datos
    timestamps: false // Deshabilita los campos 'createdAt' y 'updatedAt' de Sequelize
  });

  return Usuario;
};