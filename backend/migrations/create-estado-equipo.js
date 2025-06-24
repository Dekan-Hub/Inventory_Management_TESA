'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * Método 'up' para aplicar la migración: crea la tabla 'estado_equipo'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('estado_equipo', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Identificador único del estado del equipo'
      },
      estado: {
        type: Sequelize.ENUM('activo', 'en reparación', 'obsoleto'), // Valores del ENUM
        allowNull: false,
        comment: 'Nombre único del estado del equipo'
      }
      // No se definen createdAt/updatedAt ya que la tabla no los tiene.
    });
  },

  /**
   * Método 'down' para revertir la migración: elimina la tabla 'estado_equipo'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('estado_equipo');
  }
};
