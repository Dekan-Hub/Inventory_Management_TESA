/**
 * @file Modelo Solicitud
 * @description Modelo Sequelize para la tabla solicitudes
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Solicitud = sequelize.define('Solicitud', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único de la solicitud'
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del usuario solicitante'
    },
    tipo_solicitud: {
        type: DataTypes.ENUM('nuevo_equipo', 'mantenimiento', 'movimiento', 'otro'),
        allowNull: false,
        comment: 'Tipo de solicitud'
    },
    titulo: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Título de la solicitud'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Descripción detallada de la solicitud'
    },
    equipo_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'FK: ID del equipo relacionado (opcional)'
    },
    fecha_solicitud: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha de la solicitud'
    },
    fecha_respuesta: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Fecha de respuesta del administrador'
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada', 'en_proceso', 'completada'),
        defaultValue: 'pendiente',
        comment: 'Estado de la solicitud'
    },
    respuesta: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Respuesta del administrador'
    },
    administrador_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'FK: ID del administrador que responde'
    }
}, {
    tableName: 'solicitudes',
    timestamps: true,
    createdAt: 'fecha_solicitud',
    updatedAt: false
});

module.exports = Solicitud; 