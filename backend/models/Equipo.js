/**
 * @file Modelo de datos para la entidad 'Equipo'.
 * @description Representa la tabla 'equipos' en la base de datos.
 * Define el esquema, validaciones y asociaciones con TipoEquipo, EstadoEquipo, Ubicacion y Usuario.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Importa la instancia de Sequelize

// Importa los modelos relacionados para definir las asociaciones
const TipoEquipo = require('./TipoEquipo');
const EstadoEquipo = require('./EstadoEquipo');
const Ubicacion = require('./Ubicacion');
const Usuario = require('./Usuario');

const Equipo = sequelize.define('Equipo', {
  /**
   * @property {number} id - Identificador único del equipo.
   * Es la clave primaria y se auto-incrementa.
   */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * @property {string} codigo_activo - Código de activo único del equipo.
   * Es un identificador único para cada activo físico. No puede ser nulo o vacío.
   */
  codigo_activo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      msg: 'Este código de activo ya está registrado.'
    },
    validate: {
      notEmpty: {
        msg: 'El código de activo no puede estar vacío.'
      }
    }
  },
  /**
   * @property {string} numero_serie - Número de serie del equipo.
   * Puede ser nulo si no aplica, pero debe ser único si está presente.
   */
  numero_serie: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: {
      msg: 'Este número de serie ya está registrado.'
    }
  },
  /**
   * @property {string} modelo - Modelo del equipo.
   * No puede ser nulo o vacío.
   */
  modelo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El modelo no puede estar vacío.'
      }
    }
  },
  /**
   * @property {string} marca - Marca del equipo.
   * No puede ser nulo o vacío.
   */
  marca: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La marca no puede estar vacía.'
      }
    }
  },
  /**
   * @property {string} fecha_adquisicion - Fecha en que el equipo fue adquirido.
   * Solo almacena la fecha (YYYY-MM-DD). No puede ser nula.
   */
  fecha_adquisicion: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  /**
   * @property {string} descripcion - Descripción detallada del equipo (ej. especificaciones técnicas).
   * Puede ser nula.
   */
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  /**
   * @property {number} id_tipo_equipo - Clave foránea que referencia el ID del TipoEquipo.
   * No puede ser nula, cada equipo debe tener un tipo asociado.
   */
  id_tipo_equipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { // Define la relación con la tabla 'tipo_equipos'
      model: TipoEquipo,
      key: 'id'
    }
  },
  /**
   * @property {number} id_estado_equipo - Clave foránea que referencia el ID del EstadoEquipo.
   * No puede ser nula, cada equipo debe tener un estado asociado.
   */
  id_estado_equipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { // Define la relación con la tabla 'estado_equipos'
      model: EstadoEquipo,
      key: 'id'
    }
  },
  /**
   * @property {number} id_ubicacion - Clave foránea que referencia el ID de la Ubicacion.
   * No puede ser nula, cada equipo debe tener una ubicación asociada.
   */
  id_ubicacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { // Define la relación con la tabla 'ubicaciones'
      model: Ubicacion,
      key: 'id'
    }
  },
  /**
   * @property {number} id_usuario_asignado - Clave foránea que referencia el ID del Usuario al que está asignado el equipo.
   * Puede ser nulo si el equipo no está asignado a un usuario específico.
   */
  id_usuario_asignado: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { // Define la relación con la tabla 'usuarios'
      model: Usuario,
      key: 'id'
    }
  }
}, {
  /**
   * @property {object} options - Opciones de configuración para el modelo Sequelize.
   * @property {string} options.tableName - Nombre de la tabla en la base de datos.
   * @property {boolean} options.timestamps - Habilita las columnas `createdAt` y `updatedAt`.
   */
  tableName: 'equipos', // Nombre explícito de la tabla en la DB
  timestamps: true // Habilita createdAt y updatedAt
});

// --- Definición de Asociaciones a nivel de modelo ---
// Estas asociaciones se definen para que Sequelize entienda las relaciones al hacer includes/joins.
/**
 * @description Define que un Equipo pertenece a un TipoEquipo.
 * La clave foránea es `id_tipo_equipo`. El alias para la relación es 'tipo'.
 */
Equipo.belongsTo(TipoEquipo, { foreignKey: 'id_tipo_equipo', as: 'tipo' });
/**
 * @description Define que un Equipo pertenece a un EstadoEquipo.
 * La clave foránea es `id_estado_equipo`. El alias para la relación es 'estado'.
 */
Equipo.belongsTo(EstadoEquipo, { foreignKey: 'id_estado_equipo', as: 'estado' });
/**
 * @description Define que un Equipo pertenece a una Ubicacion.
 * La clave foránea es `id_ubicacion`. El alias para la relación es 'ubicacion'.
 */
Equipo.belongsTo(Ubicacion, { foreignKey: 'id_ubicacion', as: 'ubicacion' });
/**
 * @description Define que un Equipo puede pertenecer a un Usuario (quien lo tiene asignado).
 * La clave foránea es `id_usuario_asignado`. El alias para la relación es 'usuarioAsignado'.
 */
Equipo.belongsTo(Usuario, { foreignKey: 'id_usuario_asignado', as: 'usuarioAsignado' });

module.exports = Equipo;