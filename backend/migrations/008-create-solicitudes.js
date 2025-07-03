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
        type: Sequelize.ENUM('equipo', 'mantenimiento', 'movimiento', 'reporte'),
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
      prioridad: {
        type: Sequelize.ENUM('baja', 'media', 'alta', 'urgente'),
        allowNull: false,
        defaultValue: 'media',
        comment: 'Prioridad de la solicitud'
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'en_revision', 'aprobada', 'rechazada', 'completada', 'cancelada'),
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
      fecha_resolucion: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Fecha de resolución de la solicitud'
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Observaciones adicionales'
      },
      solicitante_id: {
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
      asignado_a_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'ID del usuario asignado para resolver la solicitud'
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
      ubicacion_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ubicaciones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'ID de la ubicación relacionada con la solicitud'
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
    await queryInterface.addIndex('solicitudes', ['solicitante_id']);
    await queryInterface.addIndex('solicitudes', ['asignado_a_id']);
    await queryInterface.addIndex('solicitudes', ['tipo_solicitud']);
    await queryInterface.addIndex('solicitudes', ['estado']);
    await queryInterface.addIndex('solicitudes', ['prioridad']);
    await queryInterface.addIndex('solicitudes', ['fecha_solicitud']);
    await queryInterface.addIndex('solicitudes', ['equipo_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('solicitudes');
  }
}; 