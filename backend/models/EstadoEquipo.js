/**
 * @file Modelo EstadoEquipo
 * @description Modelo Sequelize para la tabla estado_equipo
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EstadoEquipo = sequelize.define('EstadoEquipo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del estado'
    },
    estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Nombre del estado del equipo'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción del estado'
    },
    color: {
        type: DataTypes.STRING(20),
        defaultValue: '#6B7280',
        comment: 'Color para representación visual del estado'
    }
}, {
    tableName: 'estado_equipo',
    timestamps: false
});

module.exports = EstadoEquipo; 