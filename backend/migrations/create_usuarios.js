'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * Método 'up' para aplicar la migración: crea la tabla 'usuarios'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Identificador único del usuario'
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Nombre completo del usuario'
      },
      usuario: { // Columna para el nombre de usuario de login
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true, // Asegura que los nombres de usuario sean únicos
        comment: 'Nombre de usuario único para inicio de sesión'
      },
      correo: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true, // Asegura que los correos sean únicos
        comment: 'Correo electrónico único del usuario'
      },
      contraseña: { // Columna para el hash de la contraseña (¡con tilde!)
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Hash seguro de la contraseña'
      },
      rol: {
        type: Sequelize.ENUM('administrador', 'técnico', 'usuario'), // Valores del ENUM
        allowNull: false,
        defaultValue: 'usuario',
        comment: 'Rol del usuario (administrador, técnico, usuario)'
      },
      createdAt: { // Columna de timestamp, manejada por Sequelize por defecto
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: { // Columna de timestamp, manejada por Sequelize por defecto
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  /**
   * Método 'down' para revertir la migración: elimina la tabla 'usuarios'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
  }
};
