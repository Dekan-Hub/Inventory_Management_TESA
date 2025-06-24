'use strict';

/**
 * Seeder para la tabla 'tipo_equipo'.
 * Inserta tipos de equipo si no existen ya por su nombre.
 * ¡Alineado estrictamente con tu esquema de DB real!
 * Columnas: id, nombre, descripcion
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tiposEquipo = [
      { nombre: 'Laptop', descripcion: 'Computadoras portátiles para trabajo y estudio.' }, // Coincide con 'nombre'
      { nombre: 'Monitor', descripcion: 'Dispositivos de visualización de pantalla.' },
      { nombre: 'Impresora', descripcion: 'Dispositivos para imprimir documentos.' },
      { nombre: 'Servidor', descripcion: 'Equipos dedicados a proveer servicios de red.' }
    ];

    for (const tipo of tiposEquipo) {
      const existingTipo = await queryInterface.rawSelect('tipo_equipo', { // Tabla 'tipo_equipo'
        where: { nombre: tipo.nombre } // Campo 'nombre'
      }, ['id']); // PK 'id'

      if (!existingTipo) {
        await queryInterface.bulkInsert('tipo_equipo', [tipo], {});
        console.log(`✅ Tipo de Equipo "${tipo.nombre}" creado.`);
      } else {
        console.log(`ℹ️ Tipo de Equipo "${tipo.nombre}" ya existe. No se duplicó.`);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tipo_equipo', {
      nombre: { // Campo 'nombre'
        [Sequelize.Op.in]: ['Laptop', 'Monitor', 'Impresora', 'Servidor']
      }
    }, {});
    console.log('🗑️ Tipos de Equipo eliminados (down seeder).');
  }
};
