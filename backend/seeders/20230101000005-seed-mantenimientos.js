'use strict';

/**
 * Seeder para la tabla 'mantenimientos'.
 * Inserta registros de mantenimiento.
 * Depende de 'equipos' y 'usuarios' (para el técnico).
 * ¡Alineado estrictamente con tu esquema de DB real!
 * Columnas: id, tipo_mantenimiento, fecha, observaciones, equipo_id, tecnico_id
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener IDs de las tablas relacionadas
    const [equipoHp] = await queryInterface.sequelize.query(
      `SELECT id FROM equipos WHERE numero_serie = 'SN-HP-001'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const [equipoIbm] = await queryInterface.sequelize.query(
      `SELECT id FROM equipos WHERE numero_serie = 'SN-IBM-SERVER-003'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const [adminUser] = await queryInterface.sequelize.query(
      `SELECT id FROM usuarios WHERE usuario = 'admin'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!equipoHp || !equipoIbm || !adminUser) {
      console.warn('⚠️ No se pudieron obtener los IDs necesarios para los seeders de mantenimiento. Asegúrate de que los seeders previos se ejecutaron correctamente.');
      return;
    }

    const mantenimientos = [
      {
        tipo_mantenimiento: 'preventivo', // Coincide con tu ENUM
        fecha: '2023-01-20',
        observaciones: 'Revisión y limpieza anual de hardware.',
        equipo_id: equipoHp.id, // FK equipo_id
        tecnico_id: adminUser.id // FK tecnico_id
      },
      {
        tipo_mantenimiento: 'correctivo', // Coincide con tu ENUM
        fecha: '2023-11-01',
        observaciones: 'Reemplazo de disco duro defectuoso.',
        equipo_id: equipoIbm.id,
        tecnico_id: adminUser.id
      }
    ];

    // Para mantenimientos, se insertan directamente.
    for (const mantenimiento of mantenimientos) {
      await queryInterface.bulkInsert('mantenimientos', [mantenimiento], {});
      console.log(`✅ Mantenimiento para Equipo ID ${mantenimiento.equipo_id} (${mantenimiento.tipo_mantenimiento}) creado.`);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('mantenimientos', {
      [Sequelize.Op.or]: [
        { equipo_id: (await queryInterface.sequelize.query(`SELECT id FROM equipos WHERE numero_serie = 'SN-HP-001'`, { type: Sequelize.QueryTypes.SELECT }))[0]?.id },
        { equipo_id: (await queryInterface.sequelize.query(`SELECT id FROM equipos WHERE numero_serie = 'SN-IBM-SERVER-003'`, { type: Sequelize.QueryTypes.SELECT }))[0]?.id }
      ]
    }, {});
    console.log('🗑️ Mantenimientos eliminados (down seeder).');
  }
};
