/**
 * @file backend/models/Alerta.js
 * @description Define el modelo de base de datos para la entidad Alerta.
 * Representa notificaciones o avisos importantes dentro del sistema.
 */

const { DataTypes } = require('sequelize');

/**
 * @function
 * @param {import('sequelize').Sequelize} sequelize - La instancia de Sequelize.
 * @returns {import('sequelize').Model} El modelo Alerta definido.
 * @description Define el modelo Alerta con sus atributos y opciones.
 */
module.exports = (sequelize) => {
  /**
   * @typedef {object} AlertaAttributes
   * @property {number} id_alerta - Identificador único de la alerta (PK, auto-incrementable).
   * @property {('baja'|'media'|'alta')} tipo_alerta - Nivel de prioridad o tipo de la alerta.
   * @property {string} mensaje - Contenido del mensaje de la alerta.
   * @property {Date} fecha_creacion - Fecha y hora de creación de la alerta.
   * @property {boolean} leida - Indica si la alerta ha sido leída por el destinatario.
   * @property {number} id_usuario_destino - FK: ID del usuario al que se destina la alerta.
   * @property {number} [id_usuario_origen] - FK: ID del usuario que generó la alerta (opcional).
   * @property {number} [id_equipo_asociado] - FK: ID del equipo asociado a la alerta (opcional).
   */
  const Alerta = sequelize.define('Alerta', {
    id_alerta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único de la alerta'
    },
    tipo_alerta: {
      type: DataTypes.ENUM('baja', 'media', 'alta'),
      allowNull: false,
      comment: 'Nivel de prioridad de la alerta'
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Contenido del mensaje de la alerta'
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha y hora de creación de la alerta'
    },
    leida: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indica si la alerta ha sido leída'
    }
  }, {
    tableName: 'alertas', // Nombre de la tabla en la base de datos
    timestamps: false // Deshabilita los campos 'createdAt' y 'updatedAt'
  });
  return Alerta;
};