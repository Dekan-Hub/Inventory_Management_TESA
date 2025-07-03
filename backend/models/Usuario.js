/**
 * @file Modelo Usuario
 * @description Modelo Sequelize para la tabla usuarios
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del usuario'
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nombre completo del usuario'
    },
    usuario: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Nombre de usuario único para login'
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
        comment: 'Correo electrónico único del usuario'
    },
    contraseña: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Contraseña encriptada del usuario'
    },
    rol: {
        type: DataTypes.ENUM('administrador', 'tecnico', 'usuario'),
        allowNull: false,
        defaultValue: 'usuario',
        comment: 'Rol del usuario en el sistema'
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha de registro del usuario'
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Estado del usuario (activo/inactivo)'
    }
}, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'fecha_registro',
    updatedAt: false,
    hooks: {
        // Encriptar contraseña antes de guardar
        beforeCreate: async (usuario) => {
            if (usuario.contraseña) {
                usuario.contraseña = await bcrypt.hash(usuario.contraseña, 10);
            }
        },
        beforeUpdate: async (usuario) => {
            if (usuario.changed('contraseña')) {
                usuario.contraseña = await bcrypt.hash(usuario.contraseña, 10);
            }
        }
    }
});

// Método para comparar contraseñas
Usuario.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.contraseña);
};

// Método para obtener datos públicos (sin contraseña)
Usuario.prototype.toPublicJSON = function() {
    const values = this.toJSON();
    delete values.contraseña;
    return values;
};

module.exports = Usuario; 