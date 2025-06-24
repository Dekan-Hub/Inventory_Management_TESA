/**
 * @file backend/models/TipoEquipo.js
 * @description Define el modelo de la tabla 'tipos_equipo' en la base de datos.
 * Representa los diferentes tipos de equipos que pueden existir en el inventario.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TipoEquipo = sequelize.define('TipoEquipo', {
        id_tipo_equipo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Identificador único del tipo de equipo'
        },
        nombre_tipo: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true, // El nombre del tipo debe ser único
            comment: 'Nombre del tipo de equipo (ej. "Laptop", "Monitor", "Impresora")'
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Descripción detallada del tipo de equipo'
        }
    }, {
        tableName: 'tipos_equipo',
        timestamps: false // No usa createdAt/updatedAt automáticamente
    });

    // Las asociaciones se definirán en models/index.js para centralizarlas
    return TipoEquipo;
};
