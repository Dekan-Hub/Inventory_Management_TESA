'use strict';

/**
 * Seeder para la tabla 'movimientos'.
 * Inserta registros de movimientos de equipos.
 * Depende de 'equipos', 'ubicaciones' y 'usuarios'.
 * ¡Alineado estrictamente con tu esquema de DB real!
 * Columnas: id, fecha_movimiento, motivo, equipo_id, ubicacion_origen_id, ubicacion_destino_id, responsable_id
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener IDs de las tablas relacionadas
    const [equipoDellMonitor] = await queryInterface.sequelize.query(
      `SELECT id FROM equipos WHERE numero_serie = 'SN-DELL-002'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const [ubicacionOficina101] = await queryInterface.sequelize.query(
      `SELECT id FROM ubicaciones WHERE edificio = 'Edificio A' AND sala = 'Oficina 101'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const [ubicacionSalaReuniones] = await queryInterface.sequelize.query(
      `SELECT id FROM ubicaciones WHERE edificio = 'Edificio A' AND sala = 'Sala de Reuniones'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const [adminUser] = await queryInterface.sequelize.query(
      `SELECT id FROM usuarios WHERE usuario = 'admin'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!equipoDellMonitor || !ubicacionOficina101 || !ubicacionSalaReuniones || !adminUser) {
      console.warn('⚠️ No se pudieron obtener los IDs necesarios para los seeders de movimientos. Asegúrate de que los seeders previos se ejecutaron correctamente.');
      return;
    }

    const movimientos = [
      {
        fecha_movimiento: new Date('2024-06-20T10:30:00Z'), // Coincide con tu DB
        motivo: 'reubicación', // Coincide con tu ENUM
        equipo_id: equipoDellMonitor.id, // FK equipo_id
        ubicacion_origen_id: ubicacionOficina101.id, // FK ubicacion_origen_id
        ubicacion_destino_id: ubicacionSalaReuniones.id, // FK ubicacion_destino_id
        responsable_id: adminUser.id // FK responsable_id
      }
    ];

    // Para movimientos, se insertan directamente.
    for (const movimiento of movimientos) {
      await queryInterface.bulkInsert('movimientos', [movimiento], {});
      console.log(`✅ Movimiento para Equipo ID ${movimiento.equipo_id} (${movimiento.motivo}) creado.`);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('movimientos', {
      equipo_id: (await queryInterface.sequelize.query(`SELECT id FROM equipos WHERE numero_serie = 'SN-DELL-002'`, { type: Sequelize.QueryTypes.SELECT }))[0]?.id,
      motivo: 'reubicación'
    }, {});
    console.log('🗑️ Movimientos eliminados (down seeder).');
  }
};
