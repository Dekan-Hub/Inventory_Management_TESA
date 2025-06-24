/**
 * @file backend/models/Ubicacion.js
 * @description Define el modelo de la tabla 'ubicaciones' en la base de datos.
 * Representa las ubicaciones físicas donde pueden estar los equipos.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Ubicacion = sequelize.define('Ubicacion', {
        id_ubicacion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Identificador único de la ubicación'
        },
        nombre_ubicacion: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true, // El nombre de la ubicación debe ser único
            comment: 'Nombre descriptivo de la ubicación (ej. "Oficina 101", "Almacén Central")'
        },
        direccion: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'Dirección física completa de la ubicación'
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Notas o comentarios adicionales sobre la ubicación'
        }
    }, {
        tableName: 'ubicaciones',
        timestamps: false // No usa createdAt/updatedAt automáticamente
    });

    // Las asociaciones se definirán en models/index.js para centralizarlas
    return Ubicacion;
};
