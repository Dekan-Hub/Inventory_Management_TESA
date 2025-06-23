/**
 * @file create-solicitudes.js
 * @description Migración para crear la tabla 'solicitudes' según la Tabla de la base de datos.
 */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('solicitudes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_usuario_solicitante: { // Corresponds to 'id_usuario_solicitante' FK in document
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'usuarios', // Tabla de usuarios
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            tipo_solicitud: { // Corresponds to 'tipo_solicitud' in document
                type: Sequelize.STRING(100),
                allowNull: false
            },
            descripcion: { // Corresponds to 'descripcion' in document
                type: Sequelize.TEXT,
                allowNull: true
            },
            fecha_solicitud: { // Corresponds to 'fecha_solicitud' in document
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            estado_solicitud: { // Corresponds to 'estado_solicitud' in document
                type: Sequelize.ENUM('pendiente', 'aprobada', 'rechazada'),
                allowNull: false
            },
            fecha_respuesta: { // Corresponds to 'fecha_respuesta' in document
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            id_administrador_respuesta: { // Corresponds to 'id_administrador_respuesta' FK in document
                type: Sequelize.INTEGER,
                allowNull: true,
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
        await queryInterface.dropTable('solicitudes');
    }
};