'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * Método 'up' para aplicar la migración: crea la tabla 'equipos'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('equipos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Identificador único del equipo'
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Nombre descriptivo del equipo'
      },
      marca: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Marca del equipo'
      },
      modelo: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Modelo del equipo'
      },
      numero_serie: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true, // El número de serie debe ser único
        comment: 'Número de serie único'
      },
      fecha_adquisicion: {
        type: Sequelize.DATEONLY, // Solo fecha sin hora
        allowNull: true,
        comment: 'Fecha de adquisición del equipo'
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Observaciones detalladas del equipo'
      },
      tipo_equipo_id: { // Clave foránea a tipo_equipo
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipo_equipo', // Nombre de la tabla referenciada
          key: 'id',            // Clave primaria de la tabla referenciada
        },
        onUpdate: 'CASCADE', // Actualiza automáticamente si el ID del tipo de equipo cambia
        onDelete: 'RESTRICT', // Restringe la eliminación si hay equipos asociados
        comment: 'FK: ID del tipo de equipo'
      },
      estado_id: { // Clave foránea a estado_equipo
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'estado_equipo',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'FK: ID del estado del equipo'
      },
      ubicacion_id: { // Clave foránea a ubicaciones
        type: Sequelize.INTEGER,
        allowNull: true, // Puede ser nula si el equipo no tiene una ubicación asignada inicialmente
        references: {
          model: 'ubicaciones',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Si la ubicación se elimina, establece este campo a NULL
        comment: 'FK: ID de la ubicación del equipo'
      }
      // No se definen createdAt/updatedAt ya que la tabla no los tiene.
    });
  },

  /**
   * Método 'down' para revertir la migración: elimina la tabla 'equipos'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('equipos');
  }
};
