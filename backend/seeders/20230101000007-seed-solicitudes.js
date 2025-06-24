'use strict';

/**
 * Seeder para la tabla 'solicitudes'.
 * Inserta solicitudes de equipo.
 * Depende de 'usuarios' y 'equipos'.
 * ¡Alineado estrictamente con tu esquema de DB real!
 * Columnas: id, motivo, estado, fecha_solicitud, fecha_respuesta, usuario_id, equipo_id, admin_id
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener IDs de las tablas relacionadas
    const [adminUser] = await queryInterface.sequelize.query(
      `SELECT id FROM usuarios WHERE usuario = 'admin'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const [equipoHp] = await queryInterface.sequelize.query(
      `SELECT id FROM equipos WHERE numero_serie = 'SN-HP-001'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!adminUser || !equipoHp) {
      console.warn('⚠️ No se pudieron obtener los IDs necesarios para los seeders de solicitudes. Asegúrate de que los seeders previos se ejecutaron correctamente.');
      return;
    }

    const solicitudes = [
      {
        motivo: 'Solicitud de mantenimiento preventivo para Laptop HP',
        estado: 'pendiente', // Coincide con tu ENUM
        fecha_solicitud: new Date('2024-02-01T09:00:00Z'),
        fecha_respuesta: null,
        usuario_id: adminUser.id, // FK usuario_id
        equipo_id: equipoHp.id, // FK equipo_id
        admin_id: null
      },
      {
        motivo: 'Solicitud de nuevo equipo: Proyector para Sala de Reuniones',
        estado: 'aprobada', // Coincide con tu ENUM
        fecha_solicitud: new Date('2024-01-15T14:30:00Z'),
        fecha_respuesta: new Date('2024-01-16T10:00:00Z'),
        usuario_id: adminUser.id,
        equipo_id: null, // No asociado a un equipo existente al ser "nuevo equipo"
        admin_id: adminUser.id // Asumimos que el mismo admin la aprobó
      }
    ];

    // Para solicitudes, se insertan directamente.
    for (const solicitud of solicitudes) {
      await queryInterface.bulkInsert('solicitudes', [solicitud], {});
      console.log(`✅ Solicitud "${solicitud.motivo.substring(0, 30)}..." creada.`);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('solicitudes', {
      [Sequelize.Op.or]: [
        { motivo: { [Sequelize.Op.like]: 'Solicitud de mantenimiento preventivo%' } },
        { motivo: { [Sequelize.Op.like]: 'Solicitud de nuevo equipo%' } }
      ]
    }, {});
    console.log('🗑️ Solicitudes eliminadas (down seeder).');
  }
};
