'use strict';

/**
 * Seeder para la tabla 'reportes'.
 * Inserta registros de reportes.
 * Depende de 'usuarios'.
 * ¡Alineado estrictamente con tu esquema de DB real!
 * Columnas: id, tipo_reporte, datos, fecha_creacion
 * Nota: Si quieres FK a usuario, tu tabla 'reportes' debe tener 'usuario_id' como FK.
 * Por ahora, solo se basa en los campos que me diste de la tabla 'reportes'.
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Nota: Como tu CREATE TABLE para `reportes` no tiene `usuario_id` como FK,
    // este seeder NO intentará relacionar con un usuario.
    // Si necesitas esta relación, debes añadir la columna `usuario_id` a tu tabla `reportes` en MySQL.

    const reportes = [
      {
        tipo_reporte: 'Inventario General',
        datos: JSON.stringify({ totalEquipos: 3, activos: 2, enReparacion: 1 }), // Coincide con 'datos'
        fecha_creacion: new Date('2024-06-20T10:00:00Z'), // Coincide con 'fecha_creacion'
      },
      {
        tipo_reporte: 'Mantenimientos del Mes',
        datos: JSON.stringify({ totalMantenimientos: 2, preventivos: 1, correctivos: 1 }),
        fecha_creacion: new Date('2024-06-20T11:00:00Z'),
      }
    ];

    // Para reportes, se insertan directamente.
    for (const reporte of reportes) {
      await queryInterface.bulkInsert('reportes', [reporte], {});
      console.log(`✅ Reporte "${reporte.tipo_reporte}" creado.`);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('reportes', {
      [Sequelize.Op.or]: [
        { tipo_reporte: 'Inventario General' },
        { tipo_reporte: 'Mantenimientos del Mes' }
      ]
    }, {});
    console.log('🗑️ Reportes eliminados (down seeder).');
  }
};
