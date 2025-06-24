/**
 * @file backend/models/EstadoEquipo.js
 * @description Define el modelo de la tabla 'estados_equipo' en la base de datos.
 * Representa los diferentes estados en los que puede encontrarse un equipo.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const EstadoEquipo = sequelize.define('EstadoEquipo', {
        id_estado_equipo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Identificador único del estado del equipo'
        },
        nombre_estado: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true, // El nombre del estado debe ser único
            comment: 'Nombre del estado del equipo (ej. Operativo, En Mantenimiento, Desecho)'
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Descripción detallada del estado'
        }
    }, {
        tableName: 'estados_equipo',
        timestamps: false // No usa createdAt/updatedAt automáticamente
    });

    // Las asociaciones se definirán en models/index.js para centralizarlas
    return EstadoEquipo;
};
