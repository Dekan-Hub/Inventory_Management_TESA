/**
 * @file demo-estados-equipo.js
 * @description Seeder para insertar datos de estados de equipo de ejemplo.
 * Alineado con la estructura según la tabla de la base de datos.
 */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('estado_equipo', [{
            estado: 'activo',
        }, {
            estado: 'en reparación',
        }, {
            estado: 'obsoleto',
        }], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('estado_equipo', {
            estado: ['activo', 'en reparación', 'obsoleto']
        }, {});
    }
};