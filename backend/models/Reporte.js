/**
 * @file backend/models/Reporte.js
 * @description Define el modelo de la tabla 'reportes' en la base de datos.
 * Representa los reportes generados por el sistema.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Reporte = sequelize.define('Reporte', {
        id_reporte: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Identificador único del reporte'
        },
        tipo_reporte: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Tipo de reporte (ej. "Inventario General", "Historial Mantenimientos")'
        },
        fecha_generacion: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'Fecha y hora en que se generó el reporte'
        },
        datos_json: {
            type: DataTypes.JSON, // Almacena los datos del reporte en formato JSON
            allowNull: true,
            comment: 'Contenido del reporte en formato JSON'
        },
        id_usuario_genera: { // Clave foránea al usuario que generó el reporte
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'ID del usuario que generó el reporte (FK de usuarios)'
        }
    }, {
        tableName: 'reportes',
        timestamps: false // No usa createdAt/updatedAt automáticamente
    });

    // Las asociaciones se definirán en models/index.js para centralizarlas
    return Reporte;
};
