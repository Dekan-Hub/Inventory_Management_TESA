/**
 * @file Modelo Movimiento
 * @description Modelo Sequelize para la tabla movimientos
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Movimiento = sequelize.define('Movimiento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del movimiento'
    },
    equipo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del equipo'
    },
    ubicacion_origen_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID de la ubicación de origen'
    },
    ubicacion_destino_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID de la ubicación de destino'
    },
    fecha_movimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Fecha del movimiento'
    },
    responsable_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del responsable del movimiento'
    },
    motivo: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Motivo del movimiento'
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado', 'completado'),
        defaultValue: 'pendiente',
        comment: 'Estado del movimiento'
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha de registro del movimiento'
    }
}, {
    tableName: 'movimientos',
    timestamps: true,
    createdAt: 'fecha_registro',
    updatedAt: false
});

module.exports = Movimiento; 