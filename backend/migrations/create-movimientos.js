/**
 * @file create-movimientos.js
 * @description Migración para crear la tabla 'movimientos' según la Tabla de la base de datos.
 */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('movimientos', {
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
            tipo_movimiento: { // Corresponds to 'tipo_movimiento' in document
                type: Sequelize.ENUM('entrada', 'salida'),
                allowNull: false
            },
            fecha_movimiento: { // Corresponds to 'fecha_movimiento' in document
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            id_origen: { // Corresponds to 'id_origen' FK in document
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'ubicaciones', // Tabla de ubicaciones
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            id_destino: { // Corresponds to 'id_destino' FK in document
                type: Sequelize.INTEGER,
                allowNull: true, // Puede ser null si es una salida final
                references: {
                    model: 'ubicaciones', // Tabla de ubicaciones
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            id_usuario: { // Corresponds to 'id_usuario' FK in document
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'usuarios', // Tabla de usuarios
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            observaciones: { // Corresponds to 'observaciones' in document
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
        await queryInterface.dropTable('movimientos');
    }
};