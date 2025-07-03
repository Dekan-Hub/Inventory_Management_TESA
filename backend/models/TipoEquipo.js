/**
 * @file Modelo TipoEquipo
 * @description Modelo Sequelize para la tabla tipo_equipo
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TipoEquipo = sequelize.define('TipoEquipo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del tipo de equipo'
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nombre del tipo de equipo'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción detallada del tipo de equipo'
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Estado del tipo de equipo (activo/inactivo)'
    }
}, {
    tableName: 'tipo_equipo',
    timestamps: true,
    createdAt: false,
    updatedAt: false
});

module.exports = TipoEquipo; 