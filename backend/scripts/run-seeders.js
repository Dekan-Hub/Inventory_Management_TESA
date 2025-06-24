// backend/scripts/run-seeders.js
/**
 * @file Script para ejecutar los seeders de Sequelize en orden.
 * @description Conecta a la base de datos y ejecuta la función 'up' de cada seeder.
 * Es crucial para poblar la base de datos con datos iniciales o de prueba.
 */

require('dotenv').config(); // Cargar variables de entorno al inicio del script
const path = require('path');
const fs = require('fs');

// Importa la instancia de Sequelize y la función de prueba de conexión
// También importa la clase Sequelize aquí para poder pasarla a los seeders
const { sequelize, Sequelize } = require('../config/db'); // <-- CORRECCIÓN: Importar Sequelize la clase aquí

/**
 * Función principal para ejecutar todos los seeders.
 * Los seeders deben estar en la carpeta 'backend/seeders/'
 * y seguir la convención de nombres 'YYYYMMDDHHMMSS-nombre-del-seeder.js'
 * para asegurar el orden de ejecución.
 */
async function runSeeders() {
  console.log('--- Iniciando ejecución de Seeders ---');
  let transaction; // Declarar la transacción fuera del try para que sea accesible en el catch

  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida para seeders.');

    // Iniciar una transacción para envolver todas las operaciones de seeding
    // Esto asegura que si un seeder falla, todos los cambios se revierten.
    transaction = await sequelize.transaction();
    console.log('🔗 Transacción iniciada para seeders.');

    // Obtener la interfaz de consulta para ejecutar operaciones SQL directas
    const queryInterface = sequelize.getQueryInterface();

    const seedersPath = path.join(__dirname, '../seeders');
    const seederFiles = fs.readdirSync(seedersPath)
                          .filter(file => file.endsWith('.js'))
                          .sort(); // Asegura el orden alfabético/cronológico

    for (const file of seederFiles) {
      const seeder = require(path.join(seedersPath, file));
      if (typeof seeder.up === 'function') {
        console.log(`🚀 Ejecutando seeder: ${file}`);
        // CORRECCIÓN: Pasar la clase Sequelize como segundo argumento a la función 'up' del seeder
        await seeder.up(queryInterface, Sequelize);
      } else {
        console.warn(`⚠️ Seeder "${file}" no tiene una función 'up' exportada.`);
      }
    }

    await transaction.commit(); // Confirmar la transacción si todo fue exitoso
    console.log('🎉 Todos los Seeders ejecutados exitosamente y transacción confirmada.');

  } catch (error) {
    if (transaction) {
      await transaction.rollback(); // Revertir la transacción en caso de error
      console.error('❌ Transacción revertida debido a un error en el seeder.');
    }
    console.error('💥 Error al ejecutar los seeders:', error);
    // Mostrar un mensaje más amigable si es un error de conexión a la DB
    if (error.name === 'SequelizeConnectionError') {
      console.error('Por favor, asegúrate de que tu base de datos esté corriendo y las credenciales en .env sean correctas.');
    }
    process.exit(1); // Salir con código de error
  } finally {
    // Cerrar la conexión a la base de datos después de la ejecución
    await sequelize.close();
    console.log('🔌 Conexión a la base de datos cerrada.');
  }
}

// Ejecutar la función principal
// Esto asegura que el script se ejecute cuando se invoca directamente.
if (require.main === module) {
  runSeeders();
}