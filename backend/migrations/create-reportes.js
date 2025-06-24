'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * Método 'up' para aplicar la migración: crea la tabla 'reportes'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reportes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Identificador único del reporte'
      },
      tipo_reporte: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Tipo de reporte'
      },
      datos: {
        type: Sequelize.TEXT, // Datos del reporte (ej. JSON stringificado)
        allowNull: false,
        comment: 'Datos del reporte'
      },
      fecha_creacion: {
        type: Sequelize.DATE, // Fecha y hora de creación
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Fecha de generación del reporte'
      }
      // Tu tabla no tiene claves foráneas.
      // Si en el futuro necesitas vincular reportes a usuarios, tendrías que añadir
      // una columna `usuario_id` (INTEGER, FK a usuarios.id) aquí.
    });
  },

  /**
   * Método 'down' para revertir la migración: elimina la tabla 'reportes'.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reportes');
  }
};
