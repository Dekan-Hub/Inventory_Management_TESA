/**
 * @file backend/models/index.js
 * @description Archivo central para la gestión de modelos y asociaciones de Sequelize.
 * Este módulo importa la instancia de Sequelize, define cada modelo pasándole esa instancia,
 * y establece todas las relaciones (asociaciones) entre los modelos. Finalmente, exporta
 * la instancia de Sequelize y todos los modelos definidos para su uso en otras partes de la aplicación.
 */

// Importa la instancia de Sequelize previamente configurada en db.js.
// CRÍTICO: db.js exporta un OBJETO con 'sequelize' y 'testConnection'.
// Debemos desestructurar para obtener la instancia 'sequelize' correctamente.
const { sequelize } = require('../config/db'); // <-- LA CORRECCIÓN CLAVE AQUÍ

// Importa DataTypes de Sequelize para definir los tipos de datos de las columnas de los modelos.
const { DataTypes } = require('sequelize');

// --- Definición de Modelos Individuales ---
// Cada modelo se define llamando a 'sequelize.define()'.
// Esto asegura que cada modelo esté asociado con la misma instancia de Sequelize.

/**
 * @typedef {object} Usuario
 * @property {number} id_usuario - Identificador único del usuario (PK, auto-incrementable).
 * @property {string} nombre_usuario - Nombre de usuario único para inicio de sesión.
 * @property {string} contrasena_hash - Hash seguro de la contraseña del usuario.
 * @property {('administrador'|'empleado'|'tecnico')} rol - Rol del usuario en el sistema.
 * @property {string} correo_electronico - Correo electrónico único del usuario.
 * @property {boolean} estado_activo - Indica si la cuenta del usuario está activa o deshabilitada.
 * @property {Date} fecha_creacion - Fecha y hora de creación de la cuenta del usuario.
 * @property {Date} [ultima_conexion] - Última fecha y hora de conexión del usuario (opcional).
 */
const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del usuario'
    },
    nombre_usuario: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Nombre de usuario único'
    },
    contrasena_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Hash seguro de la contraseña'
    },
    rol: {
        type: DataTypes.ENUM('administrador', 'empleado', 'tecnico'),
        allowNull: false,
        defaultValue: 'empleado',
        comment: 'Rol del usuario (administrador, empleado, tecnico)'
    },
    correo_electronico: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Correo electrónico único del usuario'
    },
    estado_activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Estado de la cuenta (activo/inactivo)'
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha de creación del usuario'
    },
    ultima_conexion: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Fecha de la última conexión del usuario'
    }
}, {
    tableName: 'usuarios', // Nombre de la tabla en la base de datos
    timestamps: false // Deshabilita los campos 'createdAt' y 'updatedAt' de Sequelize
});

/**
 * @typedef {object} TipoEquipo
 * @property {number} id_tipo_equipo - Identificador único del tipo de equipo (PK, auto-incrementable).
 * @property {string} nombre_tipo - Nombre único del tipo de equipo (ej. "Portátil", "Impresora").
 * @property {string} [descripcion] - Descripción opcional del tipo de equipo.
 */
const TipoEquipo = sequelize.define('TipoEquipo', {
    id_tipo_equipo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del tipo de equipo'
    },
    nombre_tipo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Nombre único del tipo de equipo'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción del tipo de equipo'
    }
}, {
    tableName: 'tipos_equipo',
    timestamps: false
});

/**
 * @typedef {object} EstadoEquipo
 * @property {number} id_estado_equipo - Identificador único del estado del equipo (PK, auto-incrementable).
 * @property {string} nombre_estado - Nombre único del estado (ej. "Operativo", "En Mantenimiento", "De Baja").
 * @property {string} [descripcion] - Descripción opcional del estado.
 */
const EstadoEquipo = sequelize.define('EstadoEquipo', {
    id_estado_equipo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del estado del equipo'
    },
    nombre_estado: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Nombre único del estado del equipo'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción del estado del equipo'
    }
}, {
    tableName: 'estados_equipo',
    timestamps: false
});

/**
 * @typedef {object} Ubicacion
 * @property {number} id_ubicacion - Identificador único de la ubicación (PK, auto-incrementable).
 * @property {string} nombre_ubicacion - Nombre único de la ubicación (ej. "Oficina Principal", "Almacén A").
 * @property {string} [direccion] - Dirección física de la ubicación.
 * @property {string} [descripcion] - Descripción opcional de la ubicación.
 */
const Ubicacion = sequelize.define('Ubicacion', {
    id_ubicacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único de la ubicación'
    },
    nombre_ubicacion: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Nombre único de la ubicación'
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Dirección física de la ubicación'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción de la ubicación'
    }
}, {
    tableName: 'ubicaciones',
    timestamps: false
});

/**
 * @typedef {object} Equipo
 * @property {number} id_equipo - Identificador único del equipo (PK, auto-incrementable).
 * @property {string} nombre_equipo - Nombre descriptivo del equipo.
 * @property {string} numero_serie - Número de serie único del equipo.
 * @property {string} [modelo] - Modelo del equipo.
 * @property {string} [marca] - Marca del equipo.
 * @property {string} [descripcion] - Descripción detallada del equipo.
 * @property {Date} [fecha_adquisicion] - Fecha de adquisición del equipo.
 * @property {Date} [fecha_ultimo_mantenimiento] - Última fecha de mantenimiento del equipo.
 * @property {number} [costo_adquisicion] - Costo de adquisición del equipo.
 * @property {number} id_tipo_equipo - FK: ID del tipo de equipo al que pertenece.
 * @property {number} id_estado_equipo - FK: ID del estado actual del equipo.
 * @property {number} id_ubicacion - FK: ID de la ubicación actual del equipo.
 * @property {number} [id_usuario_asignado] - FK: ID del usuario al que está asignado el equipo (opcional).
 */
const Equipo = sequelize.define('Equipo', {
    id_equipo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del equipo'
    },
    nombre_equipo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nombre descriptivo del equipo'
    },
    numero_serie: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Número de serie único del equipo'
    },
    modelo: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Modelo del equipo'
    },
    marca: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Marca del equipo'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción detallada del equipo'
    },
    fecha_adquisicion: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Fecha de adquisición del equipo'
    },
    fecha_ultimo_mantenimiento: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Fecha del último mantenimiento realizado'
    },
    costo_adquisicion: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Costo de adquisición del equipo'
    }
}, {
    tableName: 'equipos',
    timestamps: false
});

/**
 * @typedef {object} Mantenimiento
 * @property {number} id_mantenimiento - Identificador único del registro de mantenimiento (PK, auto-incrementable).
 * @property {Date} fecha_mantenimiento - Fecha en que se realizó el mantenimiento.
 * @property {string} [descripcion_problema] - Descripción del problema que motivó el mantenimiento.
 * @property {string} [solucion_aplicada] - Descripción de la solución aplicada.
 * @property {number} [costo_mantenimiento] - Costo asociado al mantenimiento.
 * @property {number} id_equipo - FK: ID del equipo al que se le realizó el mantenimiento.
 * @property {number} id_tecnico - FK: ID del usuario (técnico) que realizó el mantenimiento.
 */
const Mantenimiento = sequelize.define('Mantenimiento', {
    id_mantenimiento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del mantenimiento'
    },
    fecha_mantenimiento: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha en que se realizó el mantenimiento'
    },
    descripcion_problema: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción del problema reportado'
    },
    solucion_aplicada: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Detalles de la solución aplicada'
    },
    costo_mantenimiento: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Costo total del mantenimiento'
    }
}, {
    tableName: 'mantenimientos',
    timestamps: false
});

/**
 * @typedef {object} Alerta
 * @property {number} id_alerta - Identificador único de la alerta (PK, auto-incrementable).
 * @property {('baja'|'media'|'alta')} tipo_alerta - Nivel de prioridad o tipo de la alerta.
 * @property {string} mensaje - Contenido del mensaje de la alerta.
 * @property {Date} fecha_creacion - Fecha y hora de creación de la alerta.
 * @property {boolean} leida - Indica si la alerta ha sido leída por el destinatario.
 * @property {number} id_usuario_destino - FK: ID del usuario al que se destina la alerta.
 * @property {number} [id_usuario_origen] - FK: ID del usuario que generó la alerta (opcional).
 * @property {number} [id_equipo_asociado] - FK: ID del equipo asociado a la alerta (opcional).
 */
const Alerta = sequelize.define('Alerta', {
    id_alerta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único de la alerta'
    },
    tipo_alerta: {
        type: DataTypes.ENUM('baja', 'media', 'alta'),
        allowNull: false,
        comment: 'Nivel de prioridad de la alerta'
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Contenido del mensaje de la alerta'
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha y hora de creación de la alerta'
    },
    leida: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indica si la alerta ha sido leída'
    }
}, {
    tableName: 'alertas',
    timestamps: false
});

/**
 * @typedef {object} Movimiento
 * @property {number} id_movimiento - Identificador único del registro de movimiento (PK, auto-incrementable).
 * @property {Date} fecha_movimiento - Fecha en que se registró el movimiento.
 * @property {('asignacion'|'reubicacion'|'retiro'|'devolucion')} tipo_movimiento - Tipo de movimiento realizado.
 * @property {string} [observaciones] - Observaciones adicionales sobre el movimiento.
 * @property {number} id_equipo - FK: ID del equipo involucrado en el movimiento.
 * @property {number} [id_usuario_realiza_movimiento] - FK: ID del usuario que registró el movimiento (opcional).
 * @property {number} [id_usuario_anterior] - FK: ID del usuario al que estaba asignado el equipo antes del movimiento (opcional).
 * @property {number} [id_usuario_actual] - FK: ID del usuario al que está asignado el equipo después del movimiento (opcional).
 * @property {number} [id_ubicacion_anterior] - FK: ID de la ubicación anterior del equipo (opcional).
 * @property {number} [id_ubicacion_actual] - FK: ID de la ubicación actual del equipo (opcional).
 */
const Movimiento = sequelize.define('Movimiento', {
    id_movimiento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del movimiento'
    },
    fecha_movimiento: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha en que se registró el movimiento'
    },
    tipo_movimiento: {
        type: DataTypes.ENUM('asignacion', 'reubicacion', 'retiro', 'devolucion'),
        allowNull: false,
        comment: 'Tipo de movimiento (asignacion, reubicacion, retiro, devolucion)'
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Observaciones adicionales sobre el movimiento'
    }
}, {
    tableName: 'movimientos',
    timestamps: false
});

/**
 * @typedef {object} Reporte
 * @property {number} id_reporte - Identificador único del reporte (PK, auto-incrementable).
 * @property {string} tipo_reporte - Tipo de reporte (ej. "Inventario Actual", "Mantenimientos por Fecha").
 * @property {Date} fecha_generacion - Fecha y hora de generación del reporte.
 * @property {object} [datos_json] - Datos estructurados del reporte en formato JSON (opcional).
 * @property {number} id_usuario_genera - FK: ID del usuario que generó el reporte.
 */
const Reporte = sequelize.define('Reporte', {
    id_reporte: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del reporte'
    },
    tipo_reporte: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Tipo de reporte generado'
    },
    fecha_generacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha y hora de generación del reporte'
    },
    datos_json: {
        type: DataTypes.JSON, // Utiliza JSON para almacenar datos estructurados flexibles
        allowNull: true,
        comment: 'Datos del reporte en formato JSON'
    }
}, {
    tableName: 'reportes',
    timestamps: false
});

/**
 * @typedef {object} Solicitud
 * @property {number} id_solicitud - Identificador único de la solicitud (PK, auto-incrementable).
 * @property {('nuevo_equipo'|'mantenimiento'|'reubicacion'|'retiro')} tipo_solicitud - Tipo de solicitud realizada.
 * @property {string} descripcion - Descripción detallada de la solicitud.
 * @property {('pendiente'|'en_proceso'|'completada'|'rechazada')} estado_solicitud - Estado actual de la solicitud.
 * @property {Date} fecha_solicitud - Fecha y hora en que se realizó la solicitud.
 * @property {Date} [fecha_resolucion] - Fecha y hora de resolución de la solicitud (opcional).
 * @property {string} [observaciones_resolutor] - Observaciones añadidas por el usuario que resolvió la solicitud (opcional).
 * @property {number} id_usuario_solicitante - FK: ID del usuario que creó la solicitud.
 * @property {number} [id_usuario_resolutor] - FK: ID del usuario que resolvió la solicitud (opcional).
 * @property {number} [id_equipo_solicitado] - FK: ID del equipo al que hace referencia la solicitud (opcional).
 */
const Solicitud = sequelize.define('Solicitud', {
    id_solicitud: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único de la solicitud'
    },
    tipo_solicitud: {
        type: DataTypes.ENUM('nuevo_equipo', 'mantenimiento', 'reubicacion', 'retiro'),
        allowNull: false,
        comment: 'Tipo de solicitud (nuevo_equipo, mantenimiento, reubicacion, retiro)'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Descripción detallada de la solicitud'
    },
    estado_solicitud: {
        type: DataTypes.ENUM('pendiente', 'en_proceso', 'completada', 'rechazada'),
        allowNull: false,
        defaultValue: 'pendiente',
        comment: 'Estado actual de la solicitud'
    },
    fecha_solicitud: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha y hora en que se realizó la solicitud'
    },
    fecha_resolucion: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Fecha y hora de resolución de la solicitud'
    },
    observaciones_resolutor: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Observaciones del resolutor de la solicitud'
    }
}, {
    tableName: 'solicitudes',
    timestamps: false
});

// --- Definición de Asociaciones entre Modelos ---
// Se establecen las relaciones entre los modelos utilizando los métodos de Sequelize.
// Cada asociación incluye un 'foreignKey' para especificar la columna en la tabla y
// un 'as' (alias) para facilitar la inclusión (eager loading) en consultas.

// Relaciones para Equipo
Equipo.belongsTo(TipoEquipo, { foreignKey: 'id_tipo_equipo', as: 'tipoDeEquipo' });
TipoEquipo.hasMany(Equipo, { foreignKey: 'id_tipo_equipo', as: 'equiposDeEsteTipo' });

Equipo.belongsTo(EstadoEquipo, { foreignKey: 'id_estado_equipo', as: 'estadoActualDelEquipo' });
EstadoEquipo.hasMany(Equipo, { foreignKey: 'id_estado_equipo', as: 'equiposSegunEstado' });

Equipo.belongsTo(Ubicacion, { foreignKey: 'id_ubicacion', as: 'ubicacionActualDelEquipo' });
Ubicacion.hasMany(Equipo, { foreignKey: 'id_ubicacion', as: 'equiposUbicadosAqui' });

Equipo.belongsTo(Usuario, { foreignKey: 'id_usuario_asignado', as: 'usuarioAsignadoAlEquipo' });
Usuario.hasMany(Equipo, { foreignKey: 'id_usuario_asignado', as: 'equiposAsignadosPorUsuario' });

// Relaciones para Mantenimiento
Mantenimiento.belongsTo(Equipo, { foreignKey: 'id_equipo', as: 'equipoDelMantenimiento' });
Equipo.hasMany(Mantenimiento, { foreignKey: 'id_equipo', as: 'mantenimientosAsociadosAEquipo' });

Mantenimiento.belongsTo(Usuario, { foreignKey: 'id_tecnico', as: 'tecnicoDelMantenimiento' });
Usuario.hasMany(Mantenimiento, { foreignKey: 'id_tecnico', as: 'mantenimientosRealizadosPorTecnico' });

// Relaciones para Alerta
Alerta.belongsTo(Usuario, { foreignKey: 'id_usuario_destino', as: 'destinatarioDeAlerta' });
Usuario.hasMany(Alerta, { foreignKey: 'id_usuario_destino', as: 'alertasRecibidasPorUsuario' });

Alerta.belongsTo(Usuario, { foreignKey: 'id_usuario_origen', as: 'remitenteDeAlerta' });
Usuario.hasMany(Alerta, { foreignKey: 'id_usuario_origen', as: 'alertasEnviadasPorUsuario' });

Alerta.belongsTo(Equipo, { foreignKey: 'id_equipo_asociado', as: 'equipoAsociadoAAlerta' });
Equipo.hasMany(Alerta, { foreignKey: 'id_equipo_asociado', as: 'alertasGeneradasPorEquipo' });

// Relaciones para Movimiento
Movimiento.belongsTo(Equipo, { foreignKey: 'id_equipo', as: 'equipoInvolucradoEnMovimiento' });
Equipo.hasMany(Movimiento, { foreignKey: 'id_equipo', as: 'historialDeMovimientosDeEquipo' });

Movimiento.belongsTo(Usuario, { foreignKey: 'id_usuario_realiza_movimiento', as: 'usuarioQueRealizoMovimiento' });
Usuario.hasMany(Movimiento, { foreignKey: 'id_usuario_realiza_movimiento', as: 'movimientosEjecutadosPorUsuario' });

Movimiento.belongsTo(Usuario, { foreignKey: 'id_usuario_anterior', as: 'usuarioAnteriorEnMovimiento' });
Usuario.hasMany(Movimiento, { foreignKey: 'id_usuario_anterior', as: 'movimientosConEsteUsuarioComoAnterior' });

Movimiento.belongsTo(Usuario, { foreignKey: 'id_usuario_actual', as: 'usuarioActualEnMovimiento' });
Usuario.hasMany(Movimiento, { foreignKey: 'id_usuario_actual', as: 'movimientosConEsteUsuarioComoActual' });

Movimiento.belongsTo(Ubicacion, { foreignKey: 'id_ubicacion_anterior', as: 'ubicacionOrigenDeMovimiento' });
Ubicacion.hasMany(Movimiento, { foreignKey: 'id_ubicacion_anterior', as: 'movimientosOriginadosEnUbicacion' });

Movimiento.belongsTo(Ubicacion, { foreignKey: 'id_ubicacion_actual', as: 'ubicacionDestinoDeMovimiento' });
Ubicacion.hasMany(Movimiento, { foreignKey: 'id_ubicacion_actual', as: 'movimientosDestinoEnUbicacion' });

// Relaciones para Reporte
Reporte.belongsTo(Usuario, { foreignKey: 'id_usuario_genera', as: 'generadorDelReporte' });
Usuario.hasMany(Reporte, { foreignKey: 'id_usuario_genera', as: 'reportesGeneradosPorElUsuario' });

// Relaciones para Solicitud
Solicitud.belongsTo(Usuario, { foreignKey: 'id_usuario_solicitante', as: 'solicitanteDeLaSolicitud' });
Usuario.hasMany(Solicitud, { foreignKey: 'id_usuario_solicitante', as: 'solicitudesRealizadasPorSolicitante' });

Solicitud.belongsTo(Usuario, { foreignKey: 'id_usuario_resolutor', as: 'resolutorDeLaSolicitud' });
Usuario.hasMany(Solicitud, { foreignKey: 'id_usuario_resolutor', as: 'solicitudesResueltasPorResolutor' });

Solicitud.belongsTo(Equipo, { foreignKey: 'id_equipo_solicitado', as: 'equipoSolicitadoEnSolicitud' });
Equipo.hasMany(Solicitud, { foreignKey: 'id_equipo_solicitado', as: 'solicitudesRelacionadasConElEquipo' });


/**
 * @exports {object} module.exports - Exporta la instancia de Sequelize y todos los modelos definidos.
 * Esto permite que otros módulos (como app.js o los controladores) importen la instancia de Sequelize
 * y accedan a los modelos definidos y sus relaciones desde un único punto centralizado.
 */
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