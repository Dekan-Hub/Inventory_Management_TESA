'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('equipos', 'costo_adquisicion');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('equipos', 'costo_adquisicion', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Costo de adquisición del equipo'
    });
  }
}; 