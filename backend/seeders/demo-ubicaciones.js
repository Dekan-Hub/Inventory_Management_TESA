/**
 * @file demo-ubicaciones.js
 * @description Seeder para insertar datos de ubicaciones de ejemplo.
 * Alineado con la estructura según la la tabla de la base de datos.
 */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('ubicaciones', [{
            edificio: 'Edificio Central',
            sala: 'Piso 1 - Oficina 101',
            descripcion: 'Oficina principal del personal administrativo.'
        }, {
            edificio: 'Edificio Laboratorio',
            sala: 'Laboratorio A',
            descripcion: 'Sala de pruebas y desarrollo.'
        }, {
            edificio: 'Edificio Bodega',
            sala: 'Almacén 001',
            descripcion: 'Área de almacenamiento de equipos.'
        }, {
            edificio: 'Edificio Central',
            sala: 'Sala de Servidores',
            descripcion: 'Centro de datos principal.'
        }], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('ubicaciones', {
            edificio: ['Edificio Central', 'Edificio Laboratorio', 'Edificio Bodega'],
            sala: ['Piso 1 - Oficina 101', 'Laboratorio A', 'Almacén 001', 'Sala de Servidores']
        }, {});
    }
};