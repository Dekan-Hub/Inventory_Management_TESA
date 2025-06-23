/**
 * @file create-usuarios.js
 * @description Migración para crear la tabla 'usuarios' según la tabla de la base de datos.
 */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('usuarios', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nombre: { // Corresponds to 'nombre' in document
                type: Sequelize.STRING(255),
                allowNull: false
            },
            usuario: { // Corresponds to 'usuario' in document
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true // Assuming 'usuario' should be unique
            },
            correo: { // Corresponds to 'correo' in document
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true // Assuming 'correo' should be unique
            },
            contraseña: { // Corresponds to 'contraseña' in document (will store hash)
                type: Sequelize.STRING(255), // Store bcrypt hash
                allowNull: false
            },
            rol: { // Corresponds to 'rol' in document
                type: Sequelize.ENUM('administrador', 'técnico', 'usuario'),
                allowNull: false
            },
            created_at: { // Corresponds to 'created_at' in document
                allowNull: true, // Document shows it as just DATE, often nullable or defaults
                type: Sequelize.DATE
            },
            updated_at: { // Corresponds to 'updated_at' in document
                allowNull: true, // Document shows it as just DATE, often nullable or defaults
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('usuarios');
    }
};