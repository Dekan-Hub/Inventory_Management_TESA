const { Sequelize } = require('sequelize'); // <--- ESTA DEBE SER LA ÚNICA VEZ QUE SE DECLARA 'Sequelize' aquí
const dotenv = require('dotenv');

// Cargar variables de entorno del archivo .env
dotenv.config();

// --- BLOQUE DE DEPURACIÓN DE VARIABLES DE ENTORNO ---
// Estos logs son útiles para verificar que tus variables .env se están cargando correctamente.
console.log('--- Iniciando depuración de variables de entorno ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_USER_PASSWORD (parte visible):', process.env.DB_USER_PASSWORD ? '*****' : 'UNDEFINED o VACÍA');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_DIALECT:', process.env.DB_DIALECT);
console.log('--- Fin de depuración de variables de entorno ---');
// --- FIN BLOQUE DE DEPURACIÓN ---

// Configuración de Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_USER_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false, // Desactiva el registro de SQL en la consola
  }
);

// Función para probar la conexión a la base de datos y sincronizar los modelos
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Sincronizar modelos con la base de datos (solo en modo de desarrollo)
    // 'alter: true' intenta modificar las tablas existentes para que coincidan con los modelos,
    // sin eliminarlas ni perder los datos. Muy útil para el desarrollo.
    if (process.env.NODE_ENV !== 'production') {
      console.log('Sincronizando modelos con la base de datos (modo desarrollo - alterando tablas)...');
      await sequelize.sync({ alter: true });
      console.log('Modelos sincronizados. Las tablas han sido actualizadas/creadas.');
    }
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    console.error('Detalles del error:', error.message);
    if (error.original && error.original.sqlMessage) {
        console.error('Error SQL original:', error.original.sqlMessage);
    }
  }
};

// Exportar la instancia de sequelize, la clase Sequelize (para Op, etc.) y la función testConnection
module.exports = {
  sequelize,
  Sequelize, // Exportamos la clase Sequelize
  testConnection,
};
