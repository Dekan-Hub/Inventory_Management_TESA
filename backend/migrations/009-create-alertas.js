'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('alertas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipo_alerta: {
        type: Sequelize.ENUM('mantenimiento', 'equipo_fuera_servicio', 'movimiento', 'solicitud_urgente', 'inventario'),
        allowNull: false,
        comment: 'Tipo de alerta generada'
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false,
        comment: 'Título de la alerta'
      },
      mensaje: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Mensaje detallado de la alerta'
      },
      prioridad: {
        type: Sequelize.ENUM('baja', 'media', 'alta', 'critica'),
        allowNull: false,
        defaultValue: 'media',
        comment: 'Prioridad de la alerta'
      },
      estado: {
        type: Sequelize.ENUM('activa', 'leida', 'resuelta', 'descartada'),
        allowNull: false,
        defaultValue: 'activa',
        comment: 'Estado actual de la alerta'
      },
      fecha_generacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha de generación de la alerta'
      },
      fecha_resolucion: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Fecha de resolución de la alerta'
      },
      fecha_vencimiento: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Fecha de vencimiento de la alerta'
      },
      equipo_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'equipos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'ID del equipo relacionado con la alerta'
      },
      mantenimiento_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'mantenimientos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'ID del mantenimiento relacionado con la alerta'
      },
      solicitud_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'solicitudes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'ID de la solicitud relacionada con la alerta'
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
        comment: 'ID del usuario destinatario de la alerta'
      },
      generado_por_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'ID del usuario que generó la alerta'
      },
      fecha_registro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha de registro de la alerta'
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
    await queryInterface.addIndex('alertas', ['tipo_alerta']);
    await queryInterface.addIndex('alertas', ['estado']);
    await queryInterface.addIndex('alertas', ['prioridad']);
    await queryInterface.addIndex('alertas', ['fecha_generacion']);
    await queryInterface.addIndex('alertas', ['usuario_destino_id']);
    await queryInterface.addIndex('alertas', ['equipo_id']);
    await queryInterface.addIndex('alertas', ['mantenimiento_id']);
    await queryInterface.addIndex('alertas', ['solicitud_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('alertas');
  }
}; 