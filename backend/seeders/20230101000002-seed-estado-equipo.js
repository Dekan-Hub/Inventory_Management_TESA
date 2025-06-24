'use strict';

/**
 * Seeder para la tabla 'estado_equipo'.
 * Inserta estados de equipo si no existen ya por su estado.
 * ¡Alineado estrictamente con tu esquema de DB real!
 * Columnas: id, estado
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const estadosEquipo = [
      { estado: 'activo' }, // Coincide con tu ENUM
      { estado: 'en reparación' }, // Coincide con tu ENUM
      { estado: 'obsoleto' } // Coincide con tu ENUM
    ];

    for (const estado of estadosEquipo) {
      const existingEstado = await queryInterface.rawSelect('estado_equipo', { // Tabla 'estado_equipo'
        where: { estado: estado.estado } // Campo 'estado'
      }, ['id']); // PK 'id'

      if (!existingEstado) {
        await queryInterface.bulkInsert('estado_equipo', [estado], {});
        console.log(`✅ Estado de Equipo "${estado.estado}" creado.`);
      } else {
        console.log(`ℹ️ Estado de Equipo "${estado.estado}" ya existe. No se duplicó.`);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('estado_equipo', {
      estado: { // Campo 'estado'
        [Sequelize.Op.in]: ['activo', 'en reparación', 'obsoleto']
      }
    }, {});
    console.log('🗑️ Estados de Equipo eliminados (down seeder).');
  }
};
