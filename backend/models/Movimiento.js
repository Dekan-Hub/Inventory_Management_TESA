/**
 * @file backend/models/Movimiento.js
 * @description Define el modelo de la tabla 'movimientos' en la base de datos.
 * Representa los traslados y cambios de asignación de equipos.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Movimiento = sequelize.define('Movimiento', {
        id_movimiento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Identificador único del movimiento'
        },
        fecha_movimiento: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'Fecha y hora en que se registró el movimiento'
        },
        tipo_movimiento: {
            type: DataTypes.ENUM('asignacion', 'reubicacion', 'retiro', 'devolucion'),
            allowNull: false,
            comment: 'Tipo de movimiento (ej. asignación a usuario, reubicación de lugar)'
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Notas o comentarios adicionales sobre el movimiento'
        },
        id_equipo: { // Clave foránea al equipo que se movió
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'ID del equipo involucrado en el movimiento (FK de equipos)'
        },
        id_usuario_realiza_movimiento: { // Clave foránea al usuario que registró el movimiento
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'ID del usuario que realizó o registró el movimiento (FK de usuarios)'
        },
        id_usuario_anterior: { // Opcional: para cambios de asignación de usuario
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'ID del usuario anterior al que estaba asignado el equipo (FK de usuarios)'
        },
        id_usuario_actual: { // Opcional: para cambios de asignación de usuario
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'ID del usuario actual al que está asignado el equipo (FK de usuarios)'
        },
        id_ubicacion_anterior: { // Opcional: para reubicaciones de lugar
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'ID de la ubicación anterior del equipo (FK de ubicaciones)'
        },
        id_ubicacion_actual: { // Opcional: para reubicaciones de lugar
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'ID de la ubicación actual del equipo (FK de ubicaciones)'
        }
    }, {
        tableName: 'movimientos',
        timestamps: false // No usa createdAt/updatedAt automáticamente
    });

    // Las asociaciones se definirán en models/index.js para centralizarlas
    return Movimiento;
};
