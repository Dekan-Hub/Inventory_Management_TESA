'use strict';
const bcrypt = require('bcryptjs');

/**
 * Seeder para la tabla 'usuarios'.
 * Crea un usuario administrador por defecto si no existe.
 * ¡Alineado estrictamente con tu esquema de DB real!
 * Columnas: id, nombre, usuario, correo, contraseña, rol, createdAt, updatedAt
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Datos del usuario administrador que queremos insertar
    const defaultAdminUser = {
      nombre: 'Administrador General', // Coincide con 'nombre' de tu DB
      usuario: 'admin', // Coincide con 'usuario' de tu DB (columna de nombre de usuario)
      correo: 'admin@inventario.com', // Coincide con 'correo' de tu DB
      contraseña: await bcrypt.hash('adminpass', 10), // ¡Coincide con 'contraseña' con tilde!
      rol: 'administrador', // Coincide con tu ENUM
      createdAt: new Date(), // Coincide con 'createdAt' (camelCase) de tu DB
      updatedAt: new Date() // Coincide con 'updatedAt' (camelCase) de tu DB
    };

    // Verificar si ya existe un usuario con este nombre de usuario o correo
    const existingUser = await queryInterface.rawSelect('usuarios', {
      where: {
        [Sequelize.Op.or]: [
          { usuario: defaultAdminUser.usuario }, // Usamos 'usuario' aquí
          { correo: defaultAdminUser.correo }
        ]
      }
    }, ['id']); // Selecciona el 'id' (PK) para comprobar la existencia

    if (!existingUser) {
      // Si el usuario no existe, lo insertamos
      await queryInterface.bulkInsert('usuarios', [defaultAdminUser], {});
      console.log('✅ Usuario administrador por defecto "admin" creado.');
    } else {
      console.log('ℹ️ Usuario administrador "admin" ya existe. No se duplicó.');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Lógica para revertir el seeder: eliminar el usuario creado
    await queryInterface.bulkDelete('usuarios', { usuario: 'admin' }, {}); // Usamos 'usuario' aquí
    console.log('🗑️ Usuario administrador "admin" eliminado (down seeder).');
  }
};
