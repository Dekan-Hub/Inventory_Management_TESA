'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * Método 'up' para aplicar la migración: crea la tabla 'tipo_equipo'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tipo_equipo', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Identificador único del tipo de equipo'
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true, // El nombre del tipo de equipo debe ser único
        comment: 'Nombre único del tipo de equipo'
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true, // La descripción puede ser nula
        comment: 'Descripción del tipo de equipo'
      }
      // No se definen createdAt/updatedAt ya que la tabla no los tiene.
    });
  },

  /**
   * Método 'down' para revertir la migración: elimina la tabla 'tipo_equipo'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tipo_equipo');
  }
};