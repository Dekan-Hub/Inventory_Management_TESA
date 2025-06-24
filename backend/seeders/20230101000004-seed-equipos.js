'use strict';

/**
 * Seeder para la tabla 'equipos'.
 * Inserta equipos si no existen ya por su número de serie.
 * Depende de 'usuarios', 'tipo_equipo', 'estado_equipo', 'ubicaciones'.
 * ¡Alineado estrictamente con tu esquema de DB real!
 * Columnas: id, nombre, marca, modelo, numero_serie, fecha_adquisicion, observaciones,
 * tipo_equipo_id, estado_id, ubicacion_id
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener IDs de las tablas relacionadas para asegurar la consistencia
    // Usamos los nombres de tablas y columnas que nos proporcionaste.
    const [tipoLaptop] = await queryInterface.sequelize.query(
      `SELECT id FROM tipo_equipo WHERE nombre = 'Laptop'`, 
      { type: Sequelize.QueryTypes.SELECT }
    );
    const [tipoMonitor] = await queryInterface.sequelize.query(
      `SELECT id FROM tipo_equipo WHERE nombre = 'Monitor'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const [estadoActivo] = await queryInterface.sequelize.query(
      `SELECT id FROM estado_equipo WHERE estado = 'activo'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const [estadoEnReparacion] = await queryInterface.sequelize.query(
      `SELECT id FROM estado_equipo WHERE estado = 'en reparación'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const [ubicacionOficina101] = await queryInterface.sequelize.query(
      `SELECT id FROM ubicaciones WHERE edificio = 'Edificio A' AND sala = 'Oficina 101'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const [ubicacionSalaServidores] = await queryInterface.sequelize.query(
      `SELECT id FROM ubicaciones WHERE edificio = 'Edificio B' AND sala = 'Sala de Servidores'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    // Para el usuario asignado, obtenemos el ID del admin que creamos en el primer seeder
    const [adminUser] = await queryInterface.sequelize.query(
      `SELECT id FROM usuarios WHERE usuario = 'admin'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const equipos = [
      {
        nombre: 'Laptop HP EliteBook',
        numero_serie: 'SN-HP-001',
        modelo: 'EliteBook G8',
        marca: 'HP',
        observaciones: 'Laptop asignada a departamento de IT.',
        fecha_adquisicion: '2022-05-20',
        // costo_adquisicion no está en tu CREATE TABLE de equipos, lo omitimos
        tipo_equipo_id: tipoLaptop ? tipoLaptop.id : null,       // FK tipo_equipo_id
        estado_id: estadoActivo ? estadoActivo.id : null,        // FK estado_id
        ubicacion_id: ubicacionOficina101 ? ubicacionOficina101.id : null, // FK ubicacion_id
        // No hay id_usuario_asignado en tu CREATE TABLE de equipos, lo omitimos
      },
      {
        nombre: 'Monitor Dell UltraSharp',
        numero_serie: 'SN-DELL-002',
        modelo: 'U2719D',
        marca: 'Dell',
        observaciones: 'Monitor principal en sala de reuniones.',
        fecha_adquisicion: '2021-11-01',
        tipo_equipo_id: tipoMonitor ? tipoMonitor.id : null,
        estado_id: estadoActivo ? estadoActivo.id : null,
        ubicacion_id: ubicacionSalaServidores ? ubicacionSalaServidores.id : null,
      },
      {
        nombre: 'Servidor Blade IBM',
        numero_serie: 'SN-IBM-SERVER-003',
        modelo: 'BladeCenter H',
        marca: 'IBM',
        observaciones: 'Servidor de respaldo, necesita revisión periódica.',
        fecha_adquisicion: '2020-01-01',
        tipo_equipo_id: (await queryInterface.sequelize.query(`SELECT id FROM tipo_equipo WHERE nombre = 'Servidor'`, { type: Sequelize.QueryTypes.SELECT }))[0]?.id || null, // <-- CORREGIDO: 'tipo_equipo'
        estado_id: estadoEnReparacion ? estadoEnReparacion.id : null,
        ubicacion_id: ubicacionSalaServidores ? ubicacionSalaServidores.id : null,
      }
    ];

    for (const equipo of equipos) {
      const existingEquipo = await queryInterface.rawSelect('equipos', {
        where: { numero_serie: equipo.numero_serie }
      }, ['id']); // PK 'id', campo 'numero_serie' es unique

      if (!existingEquipo) {
        // Verificar que las FK no sean null si son obligatorias en la DB
        if (equipo.tipo_equipo_id && equipo.estado_id) {
          await queryInterface.bulkInsert('equipos', [equipo], {});
          console.log(`✅ Equipo "${equipo.nombre}" (Serie: ${equipo.numero_serie}) creado.`);
        } else {
          console.warn(`⚠️ No se pudo crear equipo "${equipo.nombre}" debido a IDs de FK nulos. Asegúrate de que los seeders previos se ejecutaron correctamente o que las columnas no son NULL.`);
        }
      } else {
        console.log(`ℹ️ Equipo "${equipo.nombre}" (Serie: ${equipo.numero_serie}) ya existe. No se duplicó.`);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('equipos', {
      numero_serie: {
        [Sequelize.Op.in]: ['SN-HP-001', 'SN-DELL-002', 'SN-IBM-SERVER-003']
      }
    }, {});
    console.log('🗑️ Equipos eliminados (down seeder).');
  }
};
