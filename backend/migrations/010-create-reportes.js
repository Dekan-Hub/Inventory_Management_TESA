'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reportes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipo_reporte: {
        type: Sequelize.ENUM('inventario', 'mantenimiento', 'movimientos', 'solicitudes', 'alertas', 'personalizado'),
        allowNull: false,
        comment: 'Tipo de reporte generado'
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false,
        comment: 'Título del reporte'
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Descripción del reporte'
      },
      formato: {
        type: Sequelize.ENUM('pdf', 'excel', 'csv', 'html'),
        allowNull: false,
        defaultValue: 'pdf',
        comment: 'Formato del reporte'
      },
      parametros: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Parámetros utilizados para generar el reporte'
      },
      ruta_archivo: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'Ruta del archivo generado'
      },
      tamano_archivo: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Tamaño del archivo en bytes'
      },
      estado: {
        type: Sequelize.ENUM('generando', 'completado', 'error', 'expirado'),
        allowNull: false,
        defaultValue: 'generando',
        comment: 'Estado del reporte'
      },
      fecha_generacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha de generación del reporte'
      },
      fecha_completado: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Fecha de completado del reporte'
      },
      fecha_expiracion: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Fecha de expiración del reporte'
      },
      error_mensaje: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Mensaje de error si falló la generación'
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
        comment: 'ID del usuario que solicitó el reporte'
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
        comment: 'ID del equipo relacionado con el reporte'
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
        comment: 'ID de la ubicación relacionada con el reporte'
      },
      fecha_registro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha de registro del reporte'
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
    await queryInterface.addIndex('reportes', ['tipo_reporte']);
    await queryInterface.addIndex('reportes', ['estado']);
    await queryInterface.addIndex('reportes', ['fecha_generacion']);
    await queryInterface.addIndex('reportes', ['usuario_id']);
    await queryInterface.addIndex('reportes', ['formato']);
    await queryInterface.addIndex('reportes', ['equipo_id']);
    await queryInterface.addIndex('reportes', ['ubicacion_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reportes');
  }
}; 