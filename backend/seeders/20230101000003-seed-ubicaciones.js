'use strict';

/**
 * Seeder para la tabla 'ubicaciones'.
 * Inserta ubicaciones si no existen ya por la combinación de edificio y sala.
 * ¡Alineado estrictamente con tu esquema de DB real!
 * Columnas: id, edificio, sala, descripcion
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const ubicaciones = [
      { edificio: 'Edificio A', sala: 'Oficina 101', descripcion: 'Oficina principal de desarrollo.' }, // Coincide con 'edificio', 'sala'
      { edificio: 'Edificio B', sala: 'Sala de Servidores', descripcion: 'Ubicación de los servidores críticos.' },
      { edificio: 'Edificio A', sala: 'Sala de Reuniones', descripcion: 'Sala para reuniones de equipo.' }
    ];

    for (const ubicacion of ubicaciones) {
      const existingUbicacion = await queryInterface.rawSelect('ubicaciones', { // Tabla 'ubicaciones'
        where: {
          edificio: ubicacion.edificio,
          sala: ubicacion.sala
        }
      }, ['id']); // PK 'id'

      if (!existingUbicacion) {
        await queryInterface.bulkInsert('ubicaciones', [ubicacion], {});
        console.log(`✅ Ubicación "${ubicacion.edificio} - ${ubicacion.sala}" creada.`);
      } else {
        console.log(`ℹ️ Ubicación "${ubicacion.edificio} - ${ubicacion.sala}" ya existe. No se duplicó.`);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ubicaciones', {
      [Sequelize.Op.or]: [
        { edificio: 'Edificio A', sala: 'Oficina 101' },
        { edificio: 'Edificio B', sala: 'Sala de Servidores' },
        { edificio: 'Edificio A', sala: 'Sala de Reuniones' }
      ]
    }, {});
    console.log('🗑️ Ubicaciones eliminadas (down seeder).');
  }
};
