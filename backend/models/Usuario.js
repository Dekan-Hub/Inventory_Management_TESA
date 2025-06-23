/**
 * @file Modelo de datos para la entidad 'Usuario'.
 * @description Representa la tabla 'usuarios' en la base de datos.
 * Define el esquema, validaciones y hooks para el hash de contraseñas.
 * Los usuarios pueden tener diferentes roles: 'administrador', 'técnico', 'usuario'.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs'); // Importa bcrypt para el hasheo de contraseñas

const Usuario = sequelize.define('Usuario', {
  /**
   * @property {number} id - Identificador único del usuario.
   * Es la clave primaria y se auto-incrementa.
   */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * @property {string} nombre - Nombre completo del usuario.
   * No puede ser nulo y no puede estar vacío.
   */
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre no puede estar vacío.'
      }
    }
  },
  /**
   * @property {string} usuario - Nombre de usuario para iniciar sesión.
   * Debe ser único para evitar duplicados.
   */
  usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      msg: 'Este nombre de usuario ya está en uso.'
    }
  },
  /**
   * @property {string} correo - Dirección de correo electrónico del usuario.
   * Debe ser única y tener un formato de email válido.
   */
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
  /**
   * @property {string} contraseña - Contraseña del usuario (almacenada como hash).
   * No puede ser nula. Se hashea automáticamente antes de ser guardada.
   */
  contraseña: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  /**
   * @property {string} rol - Rol del usuario en el sistema.
   * Define los permisos y el acceso. Los valores permitidos son 'administrador', 'técnico', 'usuario'.
   * El valor por defecto es 'usuario'.
   */
  rol: {
    type: DataTypes.ENUM('administrador', 'técnico', 'usuario'),
    allowNull: false,
    defaultValue: 'usuario'
  }
}, {
  /**
   * @property {object} options - Opciones de configuración para el modelo Sequelize.
   * @property {string} options.tableName - Nombre de la tabla en la base de datos.
   * @property {boolean} options.timestamps - Habilita las columnas `createdAt` y `updatedAt`.
   * @property {object} options.hooks - Define funciones que se ejecutan en ciertos momentos del ciclo de vida del modelo.
   */
  tableName: 'usuarios',
  timestamps: true, // Habilita createdAt y updatedAt
  hooks: {
    /**
     * Hook `beforeCreate`: Se ejecuta antes de que un nuevo registro de usuario sea creado.
     * Se utiliza para hashear la contraseña antes de guardarla en la base de datos,
     * garantizando que las contraseñas nunca se almacenen en texto plano.
     * @param {object} usuario - La instancia del usuario que está siendo creada.
     */
    beforeCreate: async (usuario) => {
      if (usuario.contraseña) {
        const salt = await bcrypt.genSalt(10); // Genera un salt (cadena aleatoria)
        usuario.contraseña = await bcrypt.hash(usuario.contraseña, salt); // Hashea la contraseña
      }
    }
  }
});

module.exports = Usuario;