'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * Método 'up' para aplicar la migración: crea la tabla 'solicitudes'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('solicitudes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Identificador único de la solicitud'
      },
      motivo: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Motivo o descripción de la solicitud'
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'aprobada', 'rechazada'), // Valores del ENUM
        allowNull: false,
        defaultValue: 'pendiente',
        comment: 'Estado actual de la solicitud'
      },
      fecha_solicitud: {
        type: Sequelize.DATE, // Fecha y hora de la solicitud
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Fecha y hora en que se realizó la solicitud'
      },
      fecha_respuesta: {
        type: Sequelize.DATE, // Fecha y hora en que la solicitud fue respondida
        allowNull: true,
        comment: 'Fecha y hora en que la solicitud fue respondida'
      },
      usuario_id: { // Clave foránea a usuarios (solicitante)
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // Restringe la eliminación de usuario si tiene solicitudes
        comment: 'FK: ID del usuario que crea la solicitud'
      },
      equipo_id: { // Clave foránea a equipos (opcional)
        type: Sequelize.INTEGER,
        allowNull: true, // Puede ser nulo si es una solicitud de "nuevo equipo"
        references: {
          model: 'equipos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Si el equipo se elimina, este campo se establece a NULL
        comment: 'FK: ID del equipo relacionado con la solicitud (opcional)'
      },
      admin_id: { // Clave foránea a usuarios (administrador que responde, opcional)
        type: Sequelize.INTEGER,
        allowNull: true, // Puede ser nulo si aún no ha sido respondida por un admin
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Si el admin se elimina, este campo se establece a NULL
        comment: 'FK: ID del administrador que responde la solicitud (opcional)'
      }
      // Tu tabla tiene fecha_solicitud como timestamp, pero no updatedAt.
      // Si el modelo usa `timestamps: true` con `createdAt: 'fecha_solicitud'`,
      // esta migración lo creará. No hay 'updatedAt' explícito en tu SQL.
    });
  },

  /**
   * Método 'down' para revertir la migración: elimina la tabla 'solicitudes'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('solicitudes');
  }
};
