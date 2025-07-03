'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Nombre completo del usuario'
      },
      usuario: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      correo: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      contraseña: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      rol: {
        type: Sequelize.ENUM('administrador', 'tecnico', 'usuario'),
        allowNull: false,
        defaultValue: 'usuario'
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      ultimo_acceso: {
        type: Sequelize.DATE,
        allowNull: true
      },
      fecha_registro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('usuarios');
  }
}; 