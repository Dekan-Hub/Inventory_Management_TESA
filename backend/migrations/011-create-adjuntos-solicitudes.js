/**
 * @file Migración 011 - Crear tabla adjuntos_solicitudes
 * @description Tabla para almacenar archivos adjuntos de las solicitudes
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('adjuntos_solicitudes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del adjunto'
      },
      solicitud_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'FK: ID de la solicitud a la que pertenece el adjunto',
        references: {
          model: 'solicitudes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nombre_archivo: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Nombre original del archivo'
      },
      nombre_guardado: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Nombre del archivo guardado en el servidor'
      },
      ruta_archivo: {
        type: Sequelize.STRING(500),
        allowNull: false,
        comment: 'Ruta completa del archivo en el servidor'
      },
      tipo_archivo: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Tipo MIME del archivo'
      },
      tamano_bytes: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Tamaño del archivo en bytes'
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Descripción opcional del adjunto'
      },
      fecha_subida: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        comment: 'Fecha y hora de subida del archivo'
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'FK: ID del usuario que subió el archivo',
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    }, {
      tableName: 'adjuntos_solicitudes',
      timestamps: false,
      indexes: [
        {
          fields: ['solicitud_id']
        },
        {
          fields: ['usuario_id']
        },
        {
          fields: ['fecha_subida']
        }
      ]
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('adjuntos_solicitudes');
  }
}; 