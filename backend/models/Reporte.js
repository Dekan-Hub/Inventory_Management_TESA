/**
 * @file Modelo Reporte
 * @description Modelo Sequelize para la tabla reportes
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reporte = sequelize.define('Reporte', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del reporte'
    },
    tipo_reporte: {
        type: DataTypes.ENUM('inventario', 'mantenimientos', 'movimientos', 'solicitudes', 'personalizado'),
        allowNull: false,
        comment: 'Tipo de reporte'
    },
    titulo: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Título del reporte'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción del reporte'
    },
    parametros: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Parámetros del reporte en formato JSON'
    },
    fecha_generacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha de generación del reporte'
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del usuario que generó el reporte'
    },
    ruta_archivo: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Ruta del archivo generado'
    }
}, {
    tableName: 'reportes',
    timestamps: true,
    createdAt: 'fecha_generacion',
    updatedAt: false
});

// Definir relaciones
Reporte.associate = (models) => {
    Reporte.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'generador'
    });
};

module.exports = Reporte; 