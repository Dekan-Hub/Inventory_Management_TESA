/**
 * @file backend/models/Usuario.js
 * @description Define el modelo de la tabla 'usuarios' en la base de datos.
 * Representa a los usuarios del sistema (administradores, técnicos, empleados).
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Usuario = sequelize.define('Usuario', {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Identificador único del usuario'
        },
        nombre_usuario: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true, // El nombre de usuario debe ser único
            comment: 'Nombre de usuario único'
        },
        contrasena_hash: {
            type: DataTypes.STRING(255), // Almacena el hash de la contraseña
            allowNull: false,
            comment: 'Hash seguro de la contraseña'
        },
        rol: {
            type: DataTypes.ENUM('administrador', 'empleado', 'tecnico'),
            allowNull: false,
            defaultValue: 'empleado', // Rol por defecto si no se especifica
            comment: 'Rol del usuario en el sistema'
        },
        correo: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true, // El correo electrónico debe ser único
            comment: 'Correo electrónico único del usuario'
        },
        estado_activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true, // Por defecto, el usuario está activo
            comment: 'Indica si la cuenta de usuario está activa'
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'Fecha y hora en que se creó el usuario'
        },
        ultima_conexion: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Fecha y hora de la última conexión del usuario'
        }
    }, {
        tableName: 'usuarios',
        timestamps: false // No usa createdAt/updatedAt automáticamente
    });

    // Las asociaciones se definirán en models/index.js para centralizarlas
    return Usuario;
};
