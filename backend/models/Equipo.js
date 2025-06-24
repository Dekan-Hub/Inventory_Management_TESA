/**
 * @file backend/models/Equipo.js
 * @description Define el modelo de la tabla 'equipos' en la base de datos.
 * Representa los activos de inventario.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Equipo = sequelize.define('Equipo', {
        id_equipo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Identificador único del equipo'
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Nombre descriptivo del equipo (ej. "Laptop HP ZBook")'
        },
        numero_serie: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true, // El número de serie debe ser único para cada equipo
            comment: 'Número de serie único del equipo'
        },
        modelo: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Modelo específico del equipo'
        },
        marca: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: 'Marca del equipo'
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Notas o comentarios adicionales sobre el equipo'
        },
        fecha_adquisicion: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Fecha en que el equipo fue adquirido'
        },
        fecha_ultimo_mantenimiento: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Fecha del último mantenimiento realizado al equipo'
        },
        costo_adquisicion: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Costo original de adquisición del equipo'
        },
        // Claves foráneas
        TipoEquipoid: { // Nombre de la FK generada por Sequelize para la asociación belongsTo
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'ID del tipo de equipo (FK de tipos_equipo)'
        },
        EstadoEquipoid: { // Nombre de la FK generada por Sequelize
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'ID del estado actual del equipo (FK de estados_equipo)'
        },
        Ubicacionid: { // Nombre de la FK generada por Sequelize
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'ID de la ubicación actual del equipo (FK de ubicaciones)'
        },
        id_usuario_asignado: { // Nombre de la FK para el usuario al que está asignado el equipo
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'ID del usuario al que está asignado el equipo (FK de usuarios)'
        }
    }, {
        tableName: 'equipos',
        timestamps: false // No usa createdAt/updatedAt automáticamente
    });

    // Las asociaciones se definirán en models/index.js para centralizarlas
    return Equipo;
};
