/**
 * @file Script de Seed
 * @description Script para poblar la base de datos manualmente
 */

require('dotenv').config();
const { sequelize } = require('../config/database');
const { seedData } = require('../utils/seedData');

const runSeed = async () => {
    try {
        console.log('🌱 Iniciando script de seed...');
        
        // Sincronizar modelos con la base de datos
        await sequelize.sync({ force: false });
        console.log('✅ Modelos sincronizados');
        
        // Ejecutar seed
        await seedData();
        
        console.log('🎉 Script de seed completado exitosamente!');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error en script de seed:', error);
        process.exit(1);
    }
};

// Ejecutar script
runSeed(); 