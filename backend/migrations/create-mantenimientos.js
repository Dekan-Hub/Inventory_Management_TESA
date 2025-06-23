/**
 * @file create-mantenimientos.js
 * @description Migración para crear la tabla 'mantenimientos' según la tabla de la base de datos.
 */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('mantenimientos', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_equipo: { // Corresponds to 'id_equipo' FK in document
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'equipos', // Tabla de equipos
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL' // O 'RESTRICT', 'CASCADE'
            },
            fecha_mantenimiento: { // Corresponds to 'fecha_mantenimiento' in document
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            tipo_mantenimiento: { // Corresponds to 'tipo_mantenimiento' in document
                type: Sequelize.STRING(100),
                allowNull: false
            },
            costo: { // Corresponds to 'costo' in document
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true
            },
            observaciones: { // Corresponds to 'observaciones' in document
                type: Sequelize.TEXT,
                allowNull: true
            },
            id_tecnico: { // Corresponds to 'id_tecnico' FK in document
                type: Sequelize.INTEGER,
                allowNull: true, // Asumiendo que el técnico puede ser nulo inicialmente
                references: {
                    model: 'usuarios', // Tabla de usuarios
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            created_at: { // Corresponds to 'created_at' in document
                allowNull: true,
                type: Sequelize.DATE
            },
            updated_at: { // Corresponds to 'updated_at' in document
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('mantenimientos');
    }
};