/**
 * @file demo-equipos.js
 * @description Seeder para insertar datos de equipos de ejemplo en la tabla 'equipos'.
 * Alineado con la estructura corregida de la migración y según la tabla de la base de datos.
 *
 * NOTA IMPORTANTE: Los IDs de las claves foráneas (tipo_equipo_id, estado_id,
 * ubicacion_id, id_usuario_asignado - si lo usas en el modelo) deben existir
 * previamente en sus respectivas tablas. Asegúrate de ejecutar los seeders de
 * usuarios, tipo_equipo, estado_equipo y ubicaciones ANTES de ejecutar este seeder,
 * y ajusta los IDs si es necesario para que coincidan con los IDs generados en tu
 * base de datos.
 */

module.exports = {
    /**
     * Método `up` para la migración de datos. Inserta los registros de equipos.
     * @param {import('sequelize').QueryInterface} queryInterface - Interfaz de consulta de Sequelize.
     * @param {import('sequelize').Sequelize} Sequelize - La clase Sequelize.
     */
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('equipos', [{
            numero_serie: 'SN-LAP-001',
            nombre: 'Laptop Dell XPS 15',
            modelo: 'XPS 9500',
            marca: 'Dell',
            observaciones: 'Portátil de alto rendimiento para desarrollo de software.', // CORRECCIÓN CLAVE: de 'descripcion' a 'observaciones'
            fecha_adquisicion: '2023-01-15',
            TipoEquipoid: 1, // Asumiendo que ID 1 es 'Portátil' de tipos_equipo
            EstadoEquipoid: 1, // Asumiendo que ID 1 es 'activo' de estado_equipo
            Ubicacionid: 1, // Asumiendo que ID 1 es 'Edificio Central - Piso 1' de ubicaciones
            // id_usuario_asignado: 1, // Este campo NO está en tu schema de la Tabla 8 para equipos, lo quito.
                                   // Si lo necesitas, deberás agregarlo a la migración de equipos.
        }, {
            numero_serie: 'SN-PRT-002',
            nombre: 'Impresora HP LaserJet',
            modelo: 'LaserJet Pro M15w',
            marca: 'HP',
            observaciones: 'Impresora láser monocromática para uso general de oficina.', // CORRECCIÓN CLAVE
            fecha_adquisicion: '2022-03-10',
            TipoEquipoid: 2, // Asumiendo que ID 1 es 'Portátil' de tipos_equipo
            EstadoEquipoid: 2, // Asumiendo que ID 1 es 'activo' de estado_equipo
            Ubicacionid: 2, // Asumiendo que ID 2 es 'Laboratorio A'
            // id_usuario_asignado: null,
        }, {
            numero_serie: 'SN-MON-003',
            nombre: 'Monitor LG UltraWide',
            modelo: '29UM68-P',
            marca: 'LG',
            observaciones: 'Monitor UltraWide de 29 pulgadas, ideal para múltiples tareas.', // CORRECCIÓN CLAVE
            fecha_adquisicion: '2023-05-20',
            TipoEquipoid: 3, // Asumiendo que ID 1 es 'Portátil' de tipos_equipo
            EstadoEquipoid: 2, // Asumiendo que ID 1 es 'activo' de estado_equipo
            Ubicacionid: 1 // Asumiendo que ID 1 es 'Edificio Central - Piso 1'
            // id_usuario_asignado: 2,
        }, {
            numero_serie: 'SN-SRV-001',
            nombre: 'Servidor Dell PowerEdge',
            modelo: 'R740',
            marca: 'Dell',
            observaciones: 'Servidor potente para la gestión de bases de datos y aplicaciones críticas.', // CORRECCIÓN CLAVE
            fecha_adquisicion: '2024-02-01',
            TipoEquipoid: 4, // Asumiendo que ID 1 es 'Portátil' de tipos_equipo
            EstadoEquipoid: 1, // Asumiendo que ID 1 es 'activo' de estado_equipo
            Ubicacionid: 4 // Asumiendo que ID 4 es 'Sala de Servidores'
            // id_usuario_asignado: null,
        }], {});
    },

    /**
     * Método `down` para revertir la migración de datos. Elimina los registros insertados.
     * @param {import('sequelize').QueryInterface} queryInterface - Interfaz de consulta de Sequelize.
     * @param {import('sequelize').Sequelize} Sequelize - La clase Sequelize.
     */
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('equipos', {
            numero_serie: ['SN-LAP-001', 'SN-PRT-002', 'SN-MON-003', 'SN-SRV-001']
        }, {});
    }
};