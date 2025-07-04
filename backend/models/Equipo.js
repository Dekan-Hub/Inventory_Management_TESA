/**
 * @file Modelo Equipo
 * @description Modelo Sequelize para la tabla equipos
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Equipo = sequelize.define('Equipo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del equipo'
    },
    nombre: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Nombre descriptivo del equipo'
    },
    numero_serie: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Número de serie único del equipo'
    },
    modelo: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Modelo del equipo'
    },
    marca: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Marca del equipo'
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Observaciones adicionales del equipo'
    },
    fecha_adquisicion: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Fecha de adquisición del equipo'
    },
    tipo_equipo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del tipo de equipo'
    },
    estado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del estado del equipo'
    },
    ubicacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID de la ubicación del equipo'
    },
    usuario_asignado_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'FK: ID del usuario asignado al equipo'
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha de registro del equipo'
    }
}, {
    tableName: 'equipos',
    timestamps: true,
    createdAt: 'fecha_registro',
    updatedAt: false
});

module.exports = Equipo; 