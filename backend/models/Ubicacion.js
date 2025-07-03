/**
 * @file Modelo Ubicacion
 * @description Modelo Sequelize para la tabla ubicaciones
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ubicacion = sequelize.define('Ubicacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único de la ubicación'
    },
    edificio: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nombre del edificio'
    },
    sala: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nombre de la sala'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción de la ubicación'
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Estado de la ubicación (activa/inactiva)'
    }
}, {
    tableName: 'ubicaciones',
    timestamps: true,
    createdAt: false,
    updatedAt: false
});

module.exports = Ubicacion; 