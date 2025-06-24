'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * Método 'up' para aplicar la migración: crea la tabla 'alertas'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('alertas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Identificador único de la alerta'
      },
      mensaje: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Contenido del mensaje de la alerta'
      },
      tipo_alerta: {
        type: Sequelize.ENUM('mantenimiento', 'ubicación', 'sistema'), // Valores del ENUM
        allowNull: false,
        comment: 'Tipo de alerta (mantenimiento, ubicación, sistema)'
      },
      fecha_envio: {
        type: Sequelize.DATE, // Fecha y hora de envío
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Fecha y hora de envío de la alerta'
      },
      estado: {
        type: Sequelize.ENUM('leído', 'no leído'), // Valores del ENUM
        allowNull: false,
        defaultValue: 'no leído',
        comment: 'Estado de lectura de la alerta (leído/no leído)'
      },
      usuario_id: { // Clave foránea a usuarios (destinatario)
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Si el usuario se elimina, sus alertas también se eliminan
        comment: 'FK: ID del usuario al que se destina la alerta'
      }
      // Tu tabla tiene fecha_envio como timestamp, pero no updatedAt.
      // Si el modelo usa `timestamps: true` con `createdAt: 'fecha_envio'`,
      // esta migración lo creará. No hay 'updatedAt' explícito en tu SQL.
    });
  },

  /**
   * Método 'down' para revertir la migración: elimina la tabla 'alertas'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('alertas');
  }
};
