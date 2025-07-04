/**
 * @file Modelo AdjuntoSolicitud
 * @description Modelo Sequelize para la tabla adjuntos_solicitudes
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdjuntoSolicitud = sequelize.define('AdjuntoSolicitud', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del adjunto'
    },
    solicitud_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID de la solicitud a la que pertenece el adjunto'
    },
    nombre_archivo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Nombre original del archivo'
    },
    nombre_guardado: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Nombre del archivo guardado en el servidor'
    },
    ruta_archivo: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Ruta completa del archivo en el servidor'
    },
    tipo_archivo: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Tipo MIME del archivo'
    },
    tamano_bytes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Tamaño del archivo en bytes'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción opcional del adjunto'
    },
    fecha_subida: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha y hora de subida del archivo'
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del usuario que subió el archivo'
    }
}, {
    tableName: 'adjuntos_solicitudes',
    timestamps: false,
    createdAt: 'fecha_subida',
    updatedAt: false
});

module.exports = AdjuntoSolicitud; 