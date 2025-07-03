'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('movimientos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipo_movimiento: {
        type: Sequelize.ENUM('asignacion', 'traslado', 'devolucion', 'prestamo'),
        allowNull: false,
        comment: 'Tipo de movimiento realizado'
      },
      fecha_movimiento: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha y hora del movimiento'
      },
      motivo: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Motivo del movimiento'
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
        comment: 'ID del equipo que se mueve'
      },
      ubicacion_origen_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ubicaciones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'ID de la ubicación de origen'
      },
      ubicacion_destino_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ubicaciones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'ID de la ubicación de destino'
      },
      usuario_origen_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'ID del usuario de origen'
      },
      usuario_destino_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'ID del usuario de destino'
      },
      autorizado_por_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'ID del usuario que autorizó el movimiento'
      },
      fecha_registro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha de registro del movimiento'
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
    await queryInterface.addIndex('movimientos', ['equipo_id']);
    await queryInterface.addIndex('movimientos', ['tipo_movimiento']);
    await queryInterface.addIndex('movimientos', ['fecha_movimiento']);
    await queryInterface.addIndex('movimientos', ['ubicacion_destino_id']);
    await queryInterface.addIndex('movimientos', ['usuario_destino_id']);
    await queryInterface.addIndex('movimientos', ['autorizado_por_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('movimientos');
  }
}; 