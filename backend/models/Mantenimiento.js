/**
 * @file Modelo Mantenimiento
 * @description Modelo Sequelize para la tabla mantenimientos
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Mantenimiento = sequelize.define('Mantenimiento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del mantenimiento'
    },
    equipo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del equipo'
    },
    tipo_mantenimiento: {
        type: DataTypes.ENUM('preventivo', 'correctivo', 'calibracion'),
        allowNull: false,
        comment: 'Tipo de mantenimiento'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Descripción del mantenimiento'
    },
    fecha_mantenimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Fecha del mantenimiento'
    },
    tecnico_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del técnico responsable'
    },
    costo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Costo del mantenimiento'
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Observaciones adicionales'
    },
    estado: {
        type: DataTypes.ENUM('programado', 'en_proceso', 'completado', 'cancelado'),
        defaultValue: 'programado',
        comment: 'Estado del mantenimiento'
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha de registro del mantenimiento'
    }
}, {
    tableName: 'mantenimientos',
    timestamps: true,
    createdAt: 'fecha_registro',
    updatedAt: false
});

module.exports = Mantenimiento; 