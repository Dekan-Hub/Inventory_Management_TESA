/**
 * @file Configuración de Autenticación
 * @description Configuración para JWT y autenticación
 */

module.exports = {
    // Configuración JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'tu_secreto_jwt_muy_seguro_aqui',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    },

    // Configuración de bcrypt
    bcrypt: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12
    },

    // Configuración de roles
    roles: {
        ADMINISTRADOR: 'administrador',
        TECNICO: 'tecnico',
        USUARIO: 'usuario'
    },

    // Configuración de permisos por rol
    permissions: {
        administrador: ['*'], // Acceso completo
        tecnico: [
            'equipos.read',
            'equipos.create',
            'equipos.update',
            'mantenimientos.*',
            'movimientos.*',
            'reportes.read'
        ],
        usuario: [
            'equipos.read.assigned',
            'solicitudes.create',
            'solicitudes.read.own',
            'alertas.read.own'
        ]
    }
}; 