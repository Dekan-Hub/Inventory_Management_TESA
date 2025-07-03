/**
 * @file Configuración General
 * @description Configuraciones generales compartidas del sistema
 */

module.exports = {
    // Configuración del servidor
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        environment: process.env.NODE_ENV || 'development'
    },

    // Configuración de CORS
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true
    },

    // Configuración de rate limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // máximo 100 requests por ventana
    },

    // Configuración de logging
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
    },

    // Configuración de paginación
    pagination: {
        defaultLimit: 10,
        maxLimit: 100
    },

    // Configuración de archivos
    upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        uploadPath: './uploads/'
    },

    // Configuración de reportes
    reports: {
        exportPath: './exports/',
        maxRecordsPerReport: 10000
    }
}; 