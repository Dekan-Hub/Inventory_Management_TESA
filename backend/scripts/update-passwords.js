/**
 * @file backend/scripts/update-passwords.js
 * @description Script para encriptar las contraseñas existentes en texto plano en la base de datos.
 * ATENCIÓN: Este script es solo un esqueleto. La implementación real debe manejar cuidadosamente
 * la lógica de consulta, hashing y actualización por lotes, así como la gestión de errores.
 * ¡Haga una copia de seguridad de su base de datos antes de ejecutar esto en un entorno de producción!
 */

require('dotenv').config();
const bcrypt = require('bcryptjs'); // Instala con `npm install bcryptjs`
const { Usuario, sequelize } = require('../models'); // Asegúrate de que Usuario y sequelize sean exportados
const logger = require('../utils/logger'); // Importa tu logger

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || 10); // Desde tu .env o por defecto 10

async function updatePasswords() {
    logger.info('Iniciando el script de actualización de contraseñas...');
    let transaction;
    try {
        // Iniciar una transacción para asegurar la integridad de los datos
        transaction = await sequelize.transaction();

        // 1. OBTENER USUARIOS CON CONTRASEÑAS NO HASHEADAS (Lógica de ejemplo)
        // Esto es un placeholder. Deberías tener un mecanismo para identificar
        // contraseñas que necesitan ser hasheadas (ej. una bandera `is_hashed: false`
        // o si `contrasena_hash` no se parece a un hash bcrypt).
        // Por seguridad, este ejemplo asume que todas las contraseñas pueden necesitar ser actualizadas.
        const usersToUpdate = await Usuario.findAll({ transaction });
        // En un caso real, podrías filtrar: `where: { contrasena_hash: { [Op.notLike]: '$2a$%' } }`
        // pero esto requeriría importar `Op` de Sequelize y conocer tu patrón de hash.

        if (usersToUpdate.length === 0) {
            logger.info('No se encontraron usuarios con contraseñas para actualizar.');
            await transaction.commit();
            process.exit(0);
        }

        logger.info(`Se encontraron ${usersToUpdate.length} usuarios potencialmente con contraseñas a actualizar.`);

        for (const user of usersToUpdate) {
            // Verifica si la contraseña ya parece un hash bcrypt
            if (user.contrasena_hash && user.contrasena_hash.startsWith('$2a$')) {
                logger.debug(`Contraseña para ${user.nombre_usuario} ya parece hasheada. Saltando.`);
                continue; // Ya hasheada, saltar
            }

            if (user.contrasena_hash) {
                const newHash = await bcrypt.hash(user.contrasena_hash, saltRounds);
                await user.update({ contrasena_hash: newHash }, { transaction });
                logger.info(`Contraseña de usuario '${user.nombre_usuario}' actualizada.`);
            } else {
                logger.warn(`Usuario '${user.nombre_usuario}' tiene una contraseña vacía. Considerar acción manual.`);
                // Opcional: Establecer una contraseña por defecto hasheada o marcar para reseteo.
            }
        }

        await transaction.commit();
        logger.info('¡Actualización de contraseñas completada con éxito!');
        process.exit(0);
    } catch (error) {
        if (transaction) await transaction.rollback();
        logger.error('Error durante la actualización de contraseñas:', error.message);
        logger.error('Detalles del error:', error.stack);
        process.exit(1);
    }
}

updatePasswords();