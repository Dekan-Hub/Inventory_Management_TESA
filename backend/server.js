/**
 * @file Servidor Principal
 * @description Configuración y arranque del servidor Express
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { testConnection } = require('./config/database');
const { seedData } = require('./utils/seedData');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const equiposRoutes = require('./routes/equipos.routes');
const tipoEquipoRoutes = require('./routes/tipo_equipo.routes');
const estadoEquipoRoutes = require('./routes/estado_equipo.routes');
const ubicacionesRoutes = require('./routes/ubicaciones.routes');
const mantenimientosRoutes = require('./routes/mantenimientos.routes');
const movimientosRoutes = require('./routes/movimientos.routes');
const solicitudesRoutes = require('./routes/solicitudes.routes');
const alertasRoutes = require('./routes/alertas.routes');
const reportesRoutes = require('./routes/reportes.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================
// MIDDLEWARES DE SEGURIDAD
// =====================================================

// Helmet para seguridad de headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por ventana
    message: {
        message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.'
    }
});
app.use('/api/', limiter);

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

// =====================================================
// MIDDLEWARES DE PARSING
// =====================================================

// Parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =====================================================
// MIDDLEWARES DE LOGGING
// =====================================================

// Morgan para logging de requests
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// =====================================================
// RUTAS
// =====================================================

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: 'API del Sistema de Gestión de Inventarios Tecnológicos',
        version: '1.0.0',
        status: 'running'
    });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/tipo-equipo', tipoEquipoRoutes);
app.use('/api/estado-equipo', estadoEquipoRoutes);
app.use('/api/ubicaciones', ubicacionesRoutes);
app.use('/api/mantenimientos', mantenimientosRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/alertas', alertasRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/dashboard', dashboardRoutes);

// =====================================================
// MIDDLEWARE DE MANEJO DE ERRORES
// =====================================================

// Importar middleware de errores
const { errorHandler, notFoundHandler } = require('./middleware/error');

// Manejo de rutas no encontradas
app.use('*', notFoundHandler);

// Middleware de manejo de errores global
app.use(errorHandler);

// =====================================================
// INICIALIZACIÓN DEL SERVIDOR
// =====================================================

const startServer = async () => {
    try {
        // Probar conexión a la base de datos
        await testConnection();

        // Poblar datos iniciales si es necesario
        if (process.env.NODE_ENV === 'development') {
            await seedData();
        }

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Manejo de señales de terminación
process.on('SIGTERM', () => {
    console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
    process.exit(0);
});

// Iniciar servidor
startServer(); 