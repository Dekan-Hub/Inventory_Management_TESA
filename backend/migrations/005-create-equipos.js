'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('equipos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      numero_serie: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      modelo: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      marca: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      fecha_adquisicion: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      costo_adquisicion: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      tipo_equipo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipo_equipo',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      estado_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'estado_equipo',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      ubicacion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ubicaciones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      usuario_asignado_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      fecha_registro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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
    await queryInterface.addIndex('equipos', ['numero_serie']);
    await queryInterface.addIndex('equipos', ['tipo_equipo_id']);
    await queryInterface.addIndex('equipos', ['estado_id']);
    await queryInterface.addIndex('equipos', ['ubicacion_id']);
    await queryInterface.addIndex('equipos', ['usuario_asignado_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('equipos');
  }
}; 