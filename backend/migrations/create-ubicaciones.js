'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * Método 'up' para aplicar la migración: crea la tabla 'ubicaciones'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ubicaciones', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Identificador único de la ubicación'
      },
      edificio: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Nombre o identificador del edificio'
      },
      sala: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Nombre o número de la sala dentro del edificio'
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Descripción adicional de la ubicación'
      }
      // No se definen createdAt/updatedAt ya que la tabla no los tiene.
    });
  },

  /**
   * Método 'down' para revertir la migración: elimina la tabla 'ubicaciones'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ubicaciones');
  }
};
