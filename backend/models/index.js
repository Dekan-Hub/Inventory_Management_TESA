/**
 * @file backend/models/index.js
 * @description Archivo central para la gestión de modelos y asociaciones de Sequelize.
 * Define los modelos de la base de datos y sus relaciones, alineados exactamente con el esquema MySQL proporcionado.
 * Se ha ajustado el modelo Usuario para utilizar `createdAt` y `updatedAt` (camelCase)
 * directamente con la gestión automática de timestamps de Sequelize,
 * asumiendo que esos son los nombres exactos de las columnas en la DB.
 */

// Importa la instancia de Sequelize y DataTypes
const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

// --- 1. Definición de Modelos (alineados con CREATE TABLE y correcciones de nombres) ---

const Usuario = sequelize.define('Usuario', {
    id: { // Coincide con `id` en CREATE TABLE
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del usuario'
    },
    nombre: { // Coincide con `nombre` en CREATE TABLE
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nombre completo del usuario'
    },
    usuario: { // Coincide con `usuario` en CREATE TABLE (nombre de usuario para login)
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Nombre de usuario único para inicio de sesión'
    },
    correo: { // Coincide con `correo` en CREATE TABLE
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Correo electrónico único del usuario'
    },
    contraseña: { // Coincide con `contraseña` en CREATE TABLE (IMPORTANTE: ¡tilde!)
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Hash seguro de la contraseña'
    },
    rol: { // Coincide con `rol` en CREATE TABLE
        type: DataTypes.ENUM('administrador', 'técnico', 'usuario'),
        allowNull: false,
        defaultValue: 'usuario',
        comment: 'Rol del usuario (administrador, técnico, usuario)'
    }
    // IMPORTANTE: NO se definen `createdAt` ni `updatedAt` como atributos aquí.
    // Sequelize los gestionará automáticamente con `timestamps: true` y buscará nombres camelCase.
}, {
    tableName: 'usuarios',
    timestamps: true, // Habilita la gestión automática de `createdAt` y `updatedAt` (camelCase)
    // NO se usan `createdAt: 'nombre_columna'` ni `updatedAt: 'nombre_columna'`
    // porque se asume que las columnas en la DB son YA `createdAt` y `updatedAt` (camelCase).
});

const TipoEquipo = sequelize.define('TipoEquipo', {
    id: { // Coincide con `id` en CREATE TABLE
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del tipo de equipo'
    },
    nombre: { // Coincide con `nombre` en CREATE TABLE
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Nombre único del tipo de equipo'
    },
    descripcion: { // Coincide con `descripcion` en CREATE TABLE
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción del tipo de equipo'
    }
}, {
    tableName: 'tipo_equipo',
    timestamps: false // No hay created_at/updated_at en esta tabla
});

const EstadoEquipo = sequelize.define('EstadoEquipo', {
    id: { // Coincide con `id` en CREATE TABLE
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del estado del equipo'
    },
    estado: { // Coincide con `estado` en CREATE TABLE
        type: DataTypes.ENUM('activo', 'en reparación', 'obsoleto'),
        allowNull: false,
        comment: 'Nombre único del estado del equipo'
    }
}, {
    tableName: 'estado_equipo',
    timestamps: false // No hay created_at/updated_at en esta tabla
});

const Ubicacion = sequelize.define('Ubicacion', {
    id: { // Coincide con `id` en CREATE TABLE
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único de la ubicación'
    },
    edificio: { // Coincide con `edificio` en CREATE TABLE
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nombre o identificador del edificio'
    },
    sala: { // Coincide con `sala` en CREATE TABLE
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nombre o número de la sala dentro del edificio'
    },
    descripcion: { // Coincide con `descripcion` en CREATE TABLE
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción adicional de la ubicación'
    }
}, {
    tableName: 'ubicaciones',
    timestamps: false // No hay created_at/updated_at en esta tabla
});

const Equipo = sequelize.define('Equipo', {
    id: { // Coincide con `id` en CREATE TABLE
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del equipo'
    },
    nombre: { // Coincide con `nombre` en CREATE TABLE
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nombre descriptivo del equipo'
    },
    marca: { // Coincide con `marca` en CREATE TABLE
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Marca del equipo'
    },
    modelo: { // Coincide con `modelo` en CREATE TABLE
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Modelo del equipo'
    },
    numero_serie: { // Coincide con `numero_serie` en CREATE TABLE
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Número de serie único'
    },
    fecha_adquisicion: { // Coincide con `fecha_adquisicion` en CREATE TABLE
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Fecha de adquisición del equipo'
    },
    observaciones: { // Coincide con `observaciones` en CREATE TABLE
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Observaciones detalladas del equipo'
    },
    // Claves Foráneas (Se definen como atributos con el nombre exacto de la columna en la DB)
    tipo_equipo_id: { // Coincide con `tipo_equipo_id` en CREATE TABLE
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del tipo de equipo'
    },
    estado_id: { // Coincide con `estado_id` en CREATE TABLE
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del estado del equipo'
    },
    ubicacion_id: { // Coincide con `ubicacion_id` en CREATE TABLE
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'FK: ID de la ubicación del equipo'
    }
}, {
    tableName: 'equipos',
    timestamps: false // No hay created_at/updated_at en esta tabla
});

const Mantenimiento = sequelize.define('Mantenimiento', {
    id: { // Coincide con `id` en CREATE TABLE
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del mantenimiento'
    },
    tipo_mantenimiento: { // Coincide con `tipo_mantenimiento` en CREATE TABLE
        type: DataTypes.ENUM('correctivo', 'preventivo'),
        allowNull: false,
        comment: 'Tipo de mantenimiento (correctivo, preventivo)'
    },
    fecha: { // Coincide con `fecha` en CREATE TABLE
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Fecha en que se realizó el mantenimiento'
    },
    observaciones: { // Coincide con `observaciones` en CREATE TABLE
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Observaciones del mantenimiento'
    },
    // Claves Foráneas
    equipo_id: { // Coincide con `equipo_id` en CREATE TABLE
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del equipo'
    },
    tecnico_id: { // Coincide con `tecnico_id` en CREATE TABLE
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del técnico'
    }
}, {
    tableName: 'mantenimientos',
    timestamps: false // No hay created_at/updated_at en esta tabla
});

const Movimiento = sequelize.define('Movimiento', {
    id: { // Coincide con `id` en CREATE TABLE
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del movimiento'
    },
    fecha_movimiento: { // Coincide con `fecha_movimiento` en CREATE TABLE
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha y hora en que se registró el movimiento'
    },
    motivo: { // Coincide con `motivo` en CREATE TABLE
        type: DataTypes.ENUM('reubicación', 'mantenimiento', 'retiro'),
        allowNull: false,
        comment: 'Motivo del movimiento'
    },
    // Claves Foráneas
    equipo_id: { // Coincide con `equipo_id` en CREATE TABLE
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del equipo involucrado'
    },
    ubicacion_origen_id: { // Coincide con `ubicacion_origen_id` en CREATE TABLE
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID de la ubicación de origen'
    },
    ubicacion_destino_id: { // Coincide con `ubicacion_destino_id` en CREATE TABLE
        type: DataTypes.INTEGER,
        allowNull: false, // Basado en tu CREATE TABLE
        comment: 'FK: ID de la ubicación de destino'
    },
    responsable_id: { // Coincide con `responsable_id` en CREATE TABLE
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del usuario responsable del movimiento'
    }
}, {
    tableName: 'movimientos',
    timestamps: true, // Tiene `fecha_movimiento` como timestamp
    createdAt: 'fecha_movimiento',
    updatedAt: false // No tiene updated_at explícito en tu tabla
});

const Reporte = sequelize.define('Reporte', {
    id: { // Coincide con `id` en CREATE TABLE
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del reporte'
    },
    tipo_reporte: { // Coincide con `tipo_reporte` en CREATE TABLE
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Tipo de reporte'
    },
    datos: { // Coincide con `datos` en CREATE TABLE (tipo TEXT)
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Datos del reporte'
    },
    fecha_creacion: { // Coincide con `fecha_creacion` en CREATE TABLE
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha de generación del reporte'
    }
}, {
    tableName: 'reportes',
    timestamps: true, // Tiene `fecha_creacion` como timestamp
    createdAt: 'fecha_creacion',
    updatedAt: false // No tiene updated_at explícito en tu tabla
});

const Solicitud = sequelize.define('Solicitud', {
    id: { // Coincide con `id` en CREATE TABLE
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único de la solicitud'
    },
    motivo: { // Coincide con `motivo` en CREATE TABLE
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Motivo o descripción de la solicitud'
    },
    estado: { // Coincide con `estado` en CREATE TABLE
        type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'),
        allowNull: false,
        defaultValue: 'pendiente',
        comment: 'Estado actual de la solicitud'
    },
    fecha_solicitud: { // Coincide con `fecha_solicitud` en CREATE TABLE
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha y hora en que se realizó la solicitud'
    },
    fecha_respuesta: { // Coincide con `fecha_respuesta` en CREATE TABLE
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Fecha y hora en que la solicitud fue respondida'
    },
    // Claves Foráneas
    usuario_id: { // Coincide con `usuario_id` en CREATE TABLE
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del usuario que crea la solicitud'
    },
    equipo_id: { // Coincide con `equipo_id` en CREATE TABLE
        type: DataTypes.INTEGER,
        allowNull: true, // Puede ser null si es una solicitud de "nuevo equipo"
        comment: 'FK: ID del equipo relacionado con la solicitud (opcional)'
    },
    admin_id: { // Coincide con `admin_id` en CREATE TABLE
        type: DataTypes.INTEGER,
        allowNull: true, // Puede ser null si aún no ha sido respondida por un admin
        comment: 'FK: ID del administrador que responde la solicitud (opcional)'
    }
}, {
    tableName: 'solicitudes',
    timestamps: true, // Habilitar timestamps automáticos
    createdAt: 'fecha_solicitud',
    updatedAt: false // No hay updated_at explícito en tu tabla
});

const Alerta = sequelize.define('Alerta', {
    id: { // Coincide con `id` en CREATE TABLE
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único de la alerta'
    },
    mensaje: { // Coincide con `mensaje` en CREATE TABLE
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Contenido del mensaje de la alerta'
    },
    tipo_alerta: { // Coincide con `tipo_alerta` en CREATE TABLE
        type: DataTypes.ENUM('mantenimiento', 'ubicación', 'sistema'),
        allowNull: false,
        comment: 'Tipo de alerta (mantenimiento, ubicación, sistema)'
    },
    fecha_envio: { // Coincide con `fecha_envio` en CREATE TABLE
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha y hora de envío de la alerta'
    },
    estado: { // Coincide con `estado` en CREATE TABLE
        type: DataTypes.ENUM('leído', 'no leído'),
        allowNull: false,
        defaultValue: 'no leído',
        comment: 'Estado de lectura de la alerta (leído/no leído)'
    },
    // Claves Foráneas
    usuario_id: { // Coincide con `usuario_id` en CREATE TABLE
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK: ID del usuario al que se destina la alerta'
    }
}, {
    tableName: 'alertas',
    timestamps: true, // Habilitar timestamps automáticos
    createdAt: 'fecha_envio',
    updatedAt: false // No hay updated_at explícito en tu tabla
});


// --- 2. Definición de Asociaciones (alineadas con Relaciones E-R) ---

// --- Asociaciones para Usuarios ---
// Usuarios 1:N Alertas (como destinatario)
Usuario.hasMany(Alerta, { foreignKey: 'usuario_id', as: 'alertasRecibidas' });
Alerta.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'destinatarioAlerta' });

// Usuarios 1:N Movimientos (como responsable)
Usuario.hasMany(Movimiento, { foreignKey: 'responsable_id', as: 'movimientosRealizados' });
Movimiento.belongsTo(Usuario, { foreignKey: 'responsable_id', as: 'responsableMovimiento' });

// Usuarios 1:N Mantenimientos (como técnico)
Usuario.hasMany(Mantenimiento, { foreignKey: 'tecnico_id', as: 'mantenimientosRealizadosPorTecnico' });
Mantenimiento.belongsTo(Usuario, { foreignKey: 'tecnico_id', as: 'tecnicoAsignado' });

// Usuarios 1:N Reportes (como generador)
// Nota: Tu CREATE TABLE para Reportes NO tiene FK a Usuario.
// Si quieres esta relación, debes añadir `id_usuario_genera INT NOT NULL` a tu tabla `reportes` en MySQL.
// Por ahora, asumo que `id_usuario_genera` es una columna conceptual que tu controlador usa, no una FK real en DB.
// Si es una FK real, deberás modificar tu CREATE TABLE para Reportes.
// Por ahora, se define como si existiera para que los modelos de Sequelize puedan referenciarla.
Usuario.hasMany(Reporte, { foreignKey: 'id_usuario_genera', as: 'reportesGenerados' });
Reporte.belongsTo(Usuario, { foreignKey: 'id_usuario_genera', as: 'generadorReporte' });

// Usuarios 1:N Solicitudes (como solicitante)
Usuario.hasMany(Solicitud, { foreignKey: 'usuario_id', as: 'solicitudesRealizadas' });
Solicitud.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'solicitante' });

// Usuarios 1:N Solicitudes (como administrador que responde)
Usuario.hasMany(Solicitud, { foreignKey: 'admin_id', as: 'solicitudesRespondidas' });
Solicitud.belongsTo(Usuario, { foreignKey: 'admin_id', as: 'administradorRespuesta' });


// --- Asociaciones para Equipos ---
// Equipos N:1 Tipo_equipo
Equipo.belongsTo(TipoEquipo, { foreignKey: 'tipo_equipo_id', as: 'tipoDeEquipo' });
TipoEquipo.hasMany(Equipo, { foreignKey: 'tipo_equipo_id', as: 'equiposDeEsteTipo' });

// Equipos N:1 Estado_equipo
Equipo.belongsTo(EstadoEquipo, { foreignKey: 'estado_id', as: 'estadoActual' });
EstadoEquipo.hasMany(Equipo, { foreignKey: 'estado_id', as: 'equiposConEsteEstado' });

// Equipos N:1 Ubicaciones
Equipo.belongsTo(Ubicacion, { foreignKey: 'ubicacion_id', as: 'ubicacionActual' });
Ubicacion.hasMany(Equipo, { foreignKey: 'ubicacion_id', as: 'equiposEnEstaUbicacion' });

// Equipos 1:N Mantenimientos
Equipo.hasMany(Mantenimiento, { foreignKey: 'equipo_id', as: 'historialMantenimientos' });
Mantenimiento.belongsTo(Equipo, { foreignKey: 'equipo_id', as: 'equipoDelMantenimiento' });

// Equipos 1:N Movimientos
Equipo.hasMany(Movimiento, { foreignKey: 'equipo_id', as: 'historialMovimientos' });
Movimiento.belongsTo(Equipo, { foreignKey: 'equipo_id', as: 'equipoDelMovimiento' });

// Equipos 1:N Solicitudes
Equipo.hasMany(Solicitud, { foreignKey: 'equipo_id', as: 'solicitudesAsociadas' });
Solicitud.belongsTo(Equipo, { foreignKey: 'equipo_id', as: 'equipoSolicitado' });


// --- Asociaciones para Ubicaciones ---
// Ubicaciones 1:N Movimientos (como origen)
Ubicacion.hasMany(Movimiento, { foreignKey: 'ubicacion_origen_id', as: 'movimientosOrigen' });
Movimiento.belongsTo(Ubicacion, { foreignKey: 'ubicacion_origen_id', as: 'ubicacionOrigen' });

// Ubicaciones 1:N Movimientos (como destino)
Ubicacion.hasMany(Movimiento, { foreignKey: 'ubicacion_destino_id', as: 'movimientosDestino' });
Movimiento.belongsTo(Ubicacion, { foreignKey: 'ubicacion_destino_id', as: 'ubicacionDestino' });

// Nota: La relación Ubicaciones 1:N con Mantenimientos que mencionaste en E-R no está en tu CREATE TABLE de Mantenimientos.
// Si necesitas esta relación, la tabla `mantenimientos` debería tener una FK a `ubicaciones`.
// Por ahora, me adhiero estrictamente a tu `CREATE TABLE` de `mantenimientos`.

// --- 3. Exportar Sequelize y Modelos ---
module.exports = {
    sequelize, // La instancia de Sequelize
    Usuario,
    TipoEquipo,
    EstadoEquipo,
    Ubicacion,
    Equipo,
    Mantenimiento,
    Alerta,
    Movimiento,
    Reporte,
    Solicitud
};
