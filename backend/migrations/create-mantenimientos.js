'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * Método 'up' para aplicar la migración: crea la tabla 'mantenimientos'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mantenimientos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Identificador único del mantenimiento'
      },
      tipo_mantenimiento: {
        type: Sequelize.ENUM('correctivo', 'preventivo'), // Valores del ENUM
        allowNull: false,
        comment: 'Tipo de mantenimiento (correctivo, preventivo)'
      },
      fecha: {
        type: Sequelize.DATEONLY, // Solo fecha sin hora
        allowNull: false,
        comment: 'Fecha en que se realizó el mantenimiento'
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Observaciones del mantenimiento'
      },
      equipo_id: { // Clave foránea a equipos
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'equipos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Si el equipo se elimina, los mantenimientos asociados también se eliminan
        comment: 'FK: ID del equipo'
      },
      tecnico_id: { // Clave foránea a usuarios (rol técnico)
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // Restringe la eliminación si hay mantenimientos asociados
        comment: 'FK: ID del técnico'
      }
      // No se definen createdAt/updatedAt ya que la tabla no los tiene.
    });
  },

  /**
   * Método 'down' para revertir la migración: elimina la tabla 'mantenimientos'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('mantenimientos');
  }
};
