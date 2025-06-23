/**
 * @file create-tipo-equipo.js
 * @description Migración para crear la tabla 'tipo_equipo' según la tabla de la base de datos.
 */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('tipo_equipo', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nombre: { // Corresponds to 'nombre' in document
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true // Assuming name should be unique
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
        await queryInterface.dropTable('tipo_equipo');
    }
};