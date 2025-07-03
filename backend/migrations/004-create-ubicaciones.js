'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ubicaciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      edificio: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      sala: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Índice compuesto para edificio + sala
    await queryInterface.addIndex('ubicaciones', ['edificio', 'sala'], {
      unique: true,
      name: 'ubicaciones_edificio_sala_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ubicaciones');
  }
}; 