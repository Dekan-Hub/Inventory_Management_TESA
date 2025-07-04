'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mantenimientos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipo_mantenimiento: {
        type: Sequelize.ENUM('preventivo', 'correctivo', 'calibracion'),
        allowNull: false,
        comment: 'Tipo de mantenimiento realizado'
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Descripción detallada del mantenimiento'
      },
      fecha_mantenimiento: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: 'Fecha del mantenimiento'
      },
      costo: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Costo del mantenimiento'
      },
      estado: {
        type: Sequelize.ENUM('programado', 'en_proceso', 'completado', 'cancelado'),
        allowNull: false,
        defaultValue: 'programado',
        comment: 'Estado actual del mantenimiento'
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Observaciones adicionales'
      },
      equipo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'equipos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'ID del equipo al que se le realiza el mantenimiento'
      },
      tecnico_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'ID del técnico responsable del mantenimiento'
      },
      solicitante_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'ID del usuario que solicitó el mantenimiento'
      },
      fecha_registro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha de registro del mantenimiento'
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
    await queryInterface.addIndex('mantenimientos', ['equipo_id']);
    await queryInterface.addIndex('mantenimientos', ['tecnico_id']);
    await queryInterface.addIndex('mantenimientos', ['estado']);
    await queryInterface.addIndex('mantenimientos', ['fecha_mantenimiento']);
    await queryInterface.addIndex('mantenimientos', ['tipo_mantenimiento']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('mantenimientos');
  }
}; 