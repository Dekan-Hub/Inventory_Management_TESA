/**
 * @file create-ubicaciones.js
 * @description Migración para crear la tabla 'ubicaciones' según la Tabla de la base de datos.
 */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ubicaciones', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            edificio: { // Corresponds to 'edificio' in document
                type: Sequelize.STRING(255),
                allowNull: false
            },
            sala: { // Corresponds to 'sala' in document
                type: Sequelize.STRING(255),
                allowNull: true // Assuming sala can be null
            },
            descripcion: { // Corresponds to 'descripcion' in document
                type: Sequelize.TEXT,
                allowNull: true
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
        await queryInterface.dropTable('ubicaciones');
    }
};