/**
 * Modelo de datos para la entidad 'Usuario'.
 * Representa la tabla 'usuarios' en la base de datos.
 * Utiliza Sequelize para definir el esquema, validaciones y hooks.
 */

// Importamos los componentes necesarios de Sequelize
const { DataTypes } = require('sequelize');
// Importamos la instancia de sequelize desde nuestra configuración de DB
const { sequelize } = require('../config/db');
// Importamos bcrypt para hashear contraseñas
const bcrypt = require('bcryptjs');

// Definimos el modelo 'Usuario'
const Usuario = sequelize.define('Usuario', {
  // --- Atributos del Modelo ---
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre no puede estar vacío.'
      }
    }
  },
  usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      msg: 'Este nombre de usuario ya está en uso.'
    }
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'Este correo electrónico ya está registrado.'
    },
    validate: {
      isEmail: {
        msg: 'Debe proporcionar un correo electrónico válido.'
      }
    }
  },
  contraseña: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('administrador', 'técnico', 'usuario'),
    allowNull: false,
    defaultValue: 'usuario' // Rol por defecto si no se especifica
  }
}, {
  // --- Opciones del Modelo ---
  tableName: 'usuarios', // Nombre explícito de la tabla en la base de datos
  timestamps: true, // Sequelize añadirá los campos createdAt y updatedAt automáticamente
  
  // --- Hooks ---
  // Los hooks son funciones que se ejecutan en ciertos momentos del ciclo de vida del modelo.
  hooks: {
    // 'beforeCreate' se ejecuta justo antes de que un nuevo registro sea guardado en la DB.
    beforeCreate: async (usuario) => {
      if (usuario.contraseña) {
        // Generamos un 'salt' (aleatoriedad) para el hasheo
        const salt = await bcrypt.genSalt(10);
        // Hasheamos la contraseña y la reemplazamos en el objeto usuario
        usuario.contraseña = await bcrypt.hash(usuario.contraseña, salt);
      }
    }
  }
});

module.exports = Usuario;