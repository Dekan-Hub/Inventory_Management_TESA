/**
 * @file backend/models/Mantenimiento.js
 * @description Define el modelo de la tabla 'mantenimientos' en la base de datos.
 * Representa los registros de mantenimientos realizados a los equipos.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Mantenimiento = sequelize.define('Mantenimiento', {
        id_mantenimiento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Identificador único del registro de mantenimiento'
        },
        fecha_mantenimiento: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'Fecha y hora en que se realizó el mantenimiento'
        },
        descripcion_problema: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Descripción del problema que motivó el mantenimiento'
        },
        solucion_aplicada: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Descripción de la solución o acciones realizadas'
        },
        costo_mantenimiento: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Costo asociado a este mantenimiento'
        },
        id_equipo: { // Clave foránea al equipo al que se le dio mantenimiento
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'ID del equipo al que se realizó el mantenimiento (FK de equipos)'
        },
        id_tecnico: { // Clave foránea al usuario que realizó el mantenimiento
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'ID del técnico o usuario que realizó el mantenimiento (FK de usuarios)'
        }
    }, {
        tableName: 'mantenimientos',
        timestamps: false // No usa createdAt/updatedAt automáticamente
    });

    // Las asociaciones se definirán en models/index.js para centralizarlas
    return Mantenimiento;
};
