'use strict';

/**
 * Seeder para la tabla 'alertas'.
 * Inserta alertas.
 * Depende de 'usuarios'.
 * ¡Alineado estrictamente con tu esquema de DB real!
 * Columnas: id, mensaje, tipo_alerta, fecha_envio, estado, usuario_id
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener IDs de las tablas relacionadas
    const [adminUser] = await queryInterface.sequelize.query(
      `SELECT id FROM usuarios WHERE usuario = 'admin'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    // Asumimos que hay un equipo para relacionar, si no se usa su ID.
    const [equipoDellMonitor] = await queryInterface.sequelize.query(
      `SELECT id FROM equipos WHERE numero_serie = 'SN-DELL-002'`,
      { type: Sequelize.QueryTypes.SELECT }
    );


    if (!adminUser) {
      console.warn('⚠️ No se pudo obtener el ID del usuario para los seeders de alertas. Asegúrate de que el seeder de usuarios se ejecutó.');
      return;
    }

    const alertas = [
      {
        mensaje: 'Revisar monitor con serie SN-DELL-002, falla de pixels.',
        tipo_alerta: 'mantenimiento', // Coincide con tu ENUM
        fecha_envio: new Date('2024-03-05T11:00:00Z'),
        estado: 'no leído', // Coincide con tu ENUM
        usuario_id: adminUser.id // FK usuario_id
        // Tu tabla no tiene id_equipo_asociado, id_usuario_origen. Omitimos.
      },
      {
        mensaje: 'Nuevo equipo ingresado en Edificio A - Oficina 101.',
        tipo_alerta: 'ubicación', // Coincide con tu ENUM
        fecha_envio: new Date('2024-03-06T09:30:00Z'),
        estado: 'no leído',
        usuario_id: adminUser.id
      }
    ];

    // Para alertas, se insertan directamente.
    for (const alerta of alertas) {
      await queryInterface.bulkInsert('alertas', [alerta], {});
      console.log(`✅ Alerta "${alerta.mensaje.substring(0, 30)}..." creada.`);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('alertas', {
      [Sequelize.Op.or]: [
        { mensaje: { [Sequelize.Op.like]: 'Revisar monitor con serie%' } },
        { mensaje: { [Sequelize.Op.like]: 'Nuevo equipo ingresado%' } }
      ]
    }, {});
    console.log('🗑️ Alertas eliminadas (down seeder).');
  }
};
