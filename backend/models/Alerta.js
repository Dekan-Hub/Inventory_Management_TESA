/**
 * @file Modelo Alerta
 * @description Modelo Sequelize para la tabla alertas
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Alerta = sequelize.define('Alerta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único de la alerta'
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del usuario destinatario'
    },
    tipo_alerta: {
        type: DataTypes.ENUM('mantenimiento', 'movimiento', 'solicitud', 'sistema'),
        allowNull: false,
        comment: 'Tipo de alerta'
    },
    titulo: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Título de la alerta'
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Mensaje de la alerta'
    },
    fecha_envio: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha de envío de la alerta'
    },
    leida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Estado de lectura de la alerta'
    }
}, {
    tableName: 'alertas',
    timestamps: true,
    createdAt: 'fecha_envio',
    updatedAt: false
});

module.exports = Alerta; 