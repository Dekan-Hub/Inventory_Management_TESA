/**
 * @file create-estado-equipo.js
 * @description Migración para crear la tabla 'estado_equipo' según la tabla de la base de datos
 */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('estado_equipo', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            estado: { // Corresponds to 'estado' in document
                type: Sequelize.ENUM('activo', 'en reparación', 'obsoleto'),
                allowNull: false,
                unique: true // Assuming estado should be unique
            },
            created_at: {
                allowNull: true,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('estado_equipo');
    }
};