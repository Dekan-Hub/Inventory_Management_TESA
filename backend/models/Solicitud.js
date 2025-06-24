/**
 * @file backend/models/Solicitud.js
 * @description Define el modelo de la tabla 'solicitudes' en la base de datos.
 * Representa las solicitudes de equipos (nuevos, mantenimiento, reubicación, retiro).
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Solicitud = sequelize.define('Solicitud', {
        id_solicitud: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Identificador único de la solicitud'
        },
        tipo_solicitud: {
            type: DataTypes.ENUM('nuevo_equipo', 'mantenimiento', 'reubicacion', 'retiro'),
            allowNull: false,
            comment: 'Tipo de solicitud (ej. nuevo equipo, mantenimiento)'
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Descripción detallada de la solicitud'
        },
        estado_solicitud: {
            type: DataTypes.ENUM('pendiente', 'en_proceso', 'completada', 'rechazada'),
            allowNull: false,
            defaultValue: 'pendiente', // Estado inicial por defecto
            comment: 'Estado actual de la solicitud'
        },
        fecha_solicitud: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'Fecha y hora en que se realizó la solicitud'
        },
        fecha_resolucion: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Fecha y hora en que la solicitud fue completada o rechazada'
        },
        observaciones_resolutor: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Comentarios o razones del resolutor sobre la solicitud'
        },
        id_usuario_solicitante: { // Clave foránea al usuario que hizo la solicitud
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'ID del usuario que realiza la solicitud (FK de usuarios)'
        },
        id_usuario_resolutor: { // Clave foránea al usuario que resolvió la solicitud
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'ID del usuario (administrador/técnico) que resolvió la solicitud (FK de usuarios)'
        },
        id_equipo_solicitado: { // Opcional: para solicitudes de mantenimiento/reubicación/retiro
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'ID del equipo al que se refiere la solicitud (FK de equipos)'
        }
    }, {
        tableName: 'solicitudes',
        timestamps: false // No usa createdAt/updatedAt automáticamente
    });

    // Las asociaciones se definirán en models/index.js para centralizarlas
    return Solicitud;
};
