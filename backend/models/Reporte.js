/**
 * @file Modelo de datos para la entidad 'Reporte'.
 * @description Representa la tabla 'reportes' en la base de datos (si se almacenan reportes generados).
 * Este modelo es opcional y depende de si deseas persistir información sobre los reportes exportados.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Importa la instancia de Sequelize
const Usuario = require('./Usuario'); // Importa el modelo Usuario para la asociación

const Reporte = sequelize.define('Reporte', {
  /**
   * @property {number} id - Identificador único del reporte.
   * Es la clave primaria y se auto-incrementa.
   */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * @property {string} nombre_reporte - Nombre descriptivo del reporte.
   * No puede ser nulo o vacío.
   */
  nombre_reporte: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del reporte no puede estar vacío.'
      }
    }
  },
  /**
   * @property {string} tipo_exportacion - Tipo de formato de exportación (ej. 'PDF', 'Excel').
   * No puede ser nulo o vacío.
   */
  tipo_exportacion: {
    type: DataTypes.ENUM('PDF', 'Excel'),
    allowNull: false
  },
  /**
   * @property {string} ruta_archivo - Ruta o URL donde se almacena el archivo generado (si aplica).
   * Puede ser nulo si el reporte es solo un registro de metadata.
   */
  ruta_archivo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  /**
   * @property {number} id_usuario_genera - Clave foránea que referencia al Usuario que generó el reporte.
   * No puede ser nulo.
   */
  id_usuario_genera: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { // Define la relación con la tabla 'usuarios'
      model: Usuario,
      key: 'id'
    }
  },
  /**
   * @property {object} filtros_aplicados - Objeto JSON con los filtros utilizados para generar el reporte.
   * Almacena los parámetros de búsqueda o filtrado.
   */
  filtros_aplicados: {
    type: DataTypes.JSON, // Para almacenar un objeto JSON de filtros
    allowNull: true
  }
}, {
  /**
   * @property {object} options - Opciones de configuración para el modelo Sequelize.
   * @property {string} options.tableName - Nombre de la tabla en la base de datos.
   * @property {boolean} options.timestamps - Habilita las columnas `createdAt` y `updatedAt`.
   */
  tableName: 'reportes', // Nombre explícito de la tabla en la DB
  timestamps: true // Habilita createdAt y updatedAt
});

// --- Definición de Asociaciones a nivel de modelo ---
/**
 * @description Define que un Reporte fue generado por un Usuario.
 * La clave foránea es `id_usuario_genera`. El alias para la relación es 'generador'.
 */
Reporte.belongsTo(Usuario, { foreignKey: 'id_usuario_genera', as: 'generador' });

module.exports = Reporte;