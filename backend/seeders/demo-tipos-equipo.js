/**
 * @file demo-tipos-equipo.js
 * @description Seeder para insertar datos de tipos de equipo de ejemplo.
 * Alineado con la estructura según la tabla de la base de datos.
 */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('tipo_equipo', [{
            nombre: 'Portátil',
            descripcion: 'Ordenador personal portátil para uso general.',
        }, {
            nombre: 'Impresora',
            descripcion: 'Dispositivo para imprimir documentos.',
        }, {
            nombre: 'Monitor',
            descripcion: 'Pantalla de visualización para ordenadores.',
        }, {
            nombre: 'Servidor',
            descripcion: 'Equipo informático que provee servicios a otros ordenadores.',
        }, {
            nombre: 'Router',
            descripcion: 'Dispositivo de red para la interconexión de redes.',
        }, {
            nombre: 'Smartphone',
            descripcion: 'Teléfono móvil inteligente.',
        }], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('tipo_equipo', {
            nombre: ['Portátil', 'Impresora', 'Monitor', 'Servidor', 'Router', 'Smartphone']
        }, {});
    }
};