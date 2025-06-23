/**
 * @file create-reportes.js
 * @description Migración para crear la tabla 'reportes' según la Tabla de la base de datos.
 */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('reportes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            tipo_reporte: { // Corresponds to 'tipo_reporte' in document
                type: Sequelize.STRING(100),
                allowNull: false
            },
            fecha_generacion: { // Corresponds to 'fecha_generacion' in document
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            generado_por: { // Corresponds to 'generado_por' FK in document
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'usuarios', // Tabla de usuarios
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            contenido: { // Corresponds to 'contenido' in document
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
        await queryInterface.dropTable('reportes');
    }
};