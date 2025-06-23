/**
 * @file create-alertas.js
 * @description Migración para crear la tabla 'alertas' según la Tabla de la base de datos.
 */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('alertas', {
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
                onDelete: 'SET NULL'
            },
            tipo_alerta: { // Corresponds to 'tipo_alerta' in document
                type: Sequelize.STRING(100),
                allowNull: false
            },
            descripcion: { // Corresponds to 'descripcion' in document
                type: Sequelize.TEXT,
                allowNull: true
            },
            fecha_creacion: { // Corresponds to 'fecha_creacion' in document
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            estado: { // Corresponds to 'estado' in document
                type: Sequelize.ENUM('activa', 'resuelta'),
                allowNull: false
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
        await queryInterface.dropTable('alertas');
    }
};