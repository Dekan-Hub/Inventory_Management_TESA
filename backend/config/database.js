/**
 * @file Configuración de la base de datos
 * @description Configuración de Sequelize para conectar con MySQL
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de la base de datos
const sequelize = new Sequelize(
    process.env.DB_NAME || 'inventory_management',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true
        }
    }
);

// Función para probar la conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
        process.exit(1);
    }
};

// Función para sincronizar modelos
const syncDatabase = async (force = false) => {
    try {
        await sequelize.sync({ force });
        console.log('✅ Base de datos sincronizada correctamente.');
    } catch (error) {
        console.error('❌ Error al sincronizar la base de datos:', error);
        process.exit(1);
    }
};

module.exports = {
    sequelize,
    testConnection,
    syncDatabase
}; 