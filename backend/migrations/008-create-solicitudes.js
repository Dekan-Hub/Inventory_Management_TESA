'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('solicitudes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipo_solicitud: {
        type: Sequelize.ENUM('nuevo_equipo', 'mantenimiento', 'movimiento', 'otro'),
        allowNull: false,
        comment: 'Tipo de solicitud realizada'
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false,
        comment: 'Título de la solicitud'
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Descripción detallada de la solicitud'
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'aprobada', 'rechazada', 'en_proceso', 'completada'),
        allowNull: false,
        defaultValue: 'pendiente',
        comment: 'Estado actual de la solicitud'
      },
      fecha_solicitud: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha de la solicitud'
      },
      fecha_respuesta: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Fecha de respuesta del administrador'
      },
      respuesta: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Respuesta del administrador'
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'ID del usuario que realiza la solicitud'
      },
      administrador_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'ID del administrador que responde la solicitud'
      },
      equipo_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'equipos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'ID del equipo relacionado con la solicitud'
      },
      fecha_registro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha de registro de la solicitud'
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

    // Índices para mejorar rendimiento
    await queryInterface.addIndex('solicitudes', ['usuario_id']);
    await queryInterface.addIndex('solicitudes', ['administrador_id']);
    await queryInterface.addIndex('solicitudes', ['tipo_solicitud']);
    await queryInterface.addIndex('solicitudes', ['estado']);
    await queryInterface.addIndex('solicitudes', ['fecha_solicitud']);
    await queryInterface.addIndex('solicitudes', ['equipo_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('solicitudes');
  }
}; 