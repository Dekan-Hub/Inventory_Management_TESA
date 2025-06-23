/**
 * @file backend/scripts/test-password.js
 * @description Script para probar manualmente la generación de hashes bcrypt y su comparación.
 * Útil para depuración o para generar hashes de prueba.
 * Se debe ejecutar de forma independiente: `node backend/scripts/test-password.js`
 */

require('dotenv').config();
const bcrypt = require('bcryptjs'); // Instala con `npm install bcryptjs`
const logger = require('../utils/logger'); // Importa tu logger
const readline = require('readline'); // Para leer la entrada del usuario

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || 10);

async function testPassword() {
    logger.info('Herramienta de prueba de contraseñas Bcrypt.');
    logger.info(`Rondas de salt (BCRYPT_SALT_ROUNDS): ${saltRounds}`);

    rl.question('Introduce una contraseña para hashear: ', async (password) => {
        if (!password) {
            logger.warn('No se introdujo ninguna contraseña. Saliendo.');
            rl.close();
            return;
        }

        try {
            logger.info('Generando hash...');
            const hash = await bcrypt.hash(password, saltRounds);
            logger.info(`Hash generado: ${hash}`);

            rl.question('Introduce la misma contraseña (o una diferente) para comparar con el hash: ', async (comparePassword) => {
                if (!comparePassword) {
                    logger.warn('No se introdujo contraseña para comparar. Finalizando prueba.');
                    rl.close();
                    return;
                }

                logger.info('Comparando contraseñas...');
                const match = await bcrypt.compare(comparePassword, hash);

                if (match) {
                    logger.info('¡Coincidencia de contraseñas: VERDADERO! Las contraseñas coinciden.');
                } else {
                    logger.warn('¡Coincidencia de contraseñas: FALSO! Las contraseñas NO coinciden.');
                }

                rl.close();
            });

        } catch (error) {
            logger.error('Error durante el proceso de hash/comparación:', error.message);
            logger.error('Detalles del error:', error.stack);
            rl.close();
        }
    });
}

testPassword();