/**
 * @file demo-usuarios.js
 * @description Seeder para insertar datos de usuarios de ejemplo en la tabla 'usuarios'.
 * Alineado con la estructura según la tabla de la base de datos.
 */

const bcrypt = require('bcryptjs'); // Asegúrate de tenerlo instalado: npm install bcryptjs
require('dotenv').config({ path: '../../.env' }); // Carga variables de entorno, ajusta la ruta si es necesario

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || 10); // Obtén el salt de .env o usa 10 por defecto

module.exports = {
    /**
     * Método `up` para la migración de datos. Inserta los registros de usuarios.
     * @param {import('sequelize').QueryInterface} queryInterface - Interfaz de consulta de Sequelize.
     * @param {import('sequelize').Sequelize} Sequelize - La clase Sequelize.
     */
    async up(queryInterface, Sequelize) {
        const hashedPasswordAdmin = await bcrypt.hash('Admin@123', saltRounds);
        const hashedPasswordTecnico = await bcrypt.hash('Tecnico@123', saltRounds);
        const hashedPasswordUsuario = await bcrypt.hash('Usuario@123', saltRounds);

        await queryInterface.bulkInsert('usuarios', [{
            nombre: 'Administrador TESA',
            usuario: 'admin.tesa',
            correo: 'admin@tesa.com',
            contraseña: hashedPasswordAdmin,
            rol: 'administrador',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            nombre: 'Técnico Principal',
            usuario: 'tecnico.tesa',
            correo: 'tecnico@tesa.com',
            contraseña: hashedPasswordTecnico,
            rol: 'técnico',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            nombre: 'Usuario Regular',
            usuario: 'usuario.tesa',
            correo: 'usuario@tesa.com',
            contraseña: hashedPasswordUsuario,
            rol: 'usuario',
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    /**
     * Método `down` para revertir la migración de datos. Elimina los registros insertados.
     * @param {import('sequelize').QueryInterface} queryInterface - Interfaz de consulta de Sequelize.
     * @param {import('sequelize').Sequelize} Sequelize - La clase Sequelize.
     */
    async down(queryInterface, Sequelize) {
        // Elimina los registros insertados por este seeder
        await queryInterface.bulkDelete('usuarios', {
            usuario: ['admin.tesa', 'tecnico.tesa', 'usuario.tesa']
        }, {});
    }
};