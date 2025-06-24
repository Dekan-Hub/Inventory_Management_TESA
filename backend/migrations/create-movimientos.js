'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * Método 'up' para aplicar la migración: crea la tabla 'movimientos'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('movimientos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Identificador único del movimiento'
      },
      fecha_movimiento: {
        type: Sequelize.DATE, // Fecha y hora del movimiento
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Fecha y hora en que se registró el movimiento'
      },
      motivo: {
        type: Sequelize.ENUM('reubicación', 'mantenimiento', 'retiro'), // Valores del ENUM
        allowNull: false,
        comment: 'Motivo del movimiento'
      },
      equipo_id: { // Clave foránea a equipos
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'equipos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Si el equipo se elimina, los movimientos asociados también se eliminan
        comment: 'FK: ID del equipo involucrado'
      },
      ubicacion_origen_id: { // Clave foránea a ubicaciones (origen)
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ubicaciones',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // Restringe la eliminación de ubicación si hay movimientos con ella como origen
        comment: 'FK: ID de la ubicación de origen'
      },
      ubicacion_destino_id: { // Clave foránea a ubicaciones (destino)
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ubicaciones',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // Restringe la eliminación de ubicación si hay movimientos con ella como destino
        comment: 'FK: ID de la ubicación de destino'
      },
      responsable_id: { // Clave foránea a usuarios (responsable)
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // Restringe la eliminación de usuario si es responsable de movimientos
        comment: 'FK: ID del usuario responsable del movimiento'
      }
      // Tu tabla tiene fecha_movimiento como timestamp, pero no updatedAt.
      // Si el modelo usa `timestamps: true` con `createdAt: 'fecha_movimiento'`,
      // esta migración lo creará. No hay 'updatedAt' explícito en tu SQL.
    });
  },

  /**
   * Método 'down' para revertir la migración: elimina la tabla 'movimientos'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('movimientos');
  }
};
