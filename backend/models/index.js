/**
 * @file Índice de Modelos
 * @description Define todos los modelos y sus asociaciones
 */

const { sequelize } = require('../config/database');

// Importar modelos
const Usuario = require('./Usuario');
const TipoEquipo = require('./TipoEquipo');
const EstadoEquipo = require('./EstadoEquipo');
const Ubicacion = require('./Ubicacion');
const Equipo = require('./Equipo');
const Mantenimiento = require('./Mantenimiento');
const Movimiento = require('./Movimiento');
const Solicitud = require('./Solicitud');
const AdjuntoSolicitud = require('./AdjuntoSolicitud');
const Alerta = require('./Alerta');
const Reporte = require('./Reporte');

// =====================================================
// DEFINICIÓN DE ASOCIACIONES
// =====================================================

// Usuario - Equipo (1:N)
Usuario.hasMany(Equipo, { 
    foreignKey: 'usuario_asignado_id', 
    as: 'equiposAsignados' 
});
Equipo.belongsTo(Usuario, { 
    foreignKey: 'usuario_asignado_id', 
    as: 'usuarioAsignado' 
});

// TipoEquipo - Equipo (1:N)
TipoEquipo.hasMany(Equipo, { 
    foreignKey: 'tipo_equipo_id', 
    as: 'equipos' 
});
Equipo.belongsTo(TipoEquipo, { 
    foreignKey: 'tipo_equipo_id', 
    as: 'tipoEquipo' 
});

// EstadoEquipo - Equipo (1:N)
EstadoEquipo.hasMany(Equipo, { 
    foreignKey: 'estado_id', 
    as: 'equipos' 
});
Equipo.belongsTo(EstadoEquipo, { 
    foreignKey: 'estado_id', 
    as: 'estadoEquipo' 
});

// Ubicacion - Equipo (1:N)
Ubicacion.hasMany(Equipo, { 
    foreignKey: 'ubicacion_id', 
    as: 'equipos' 
});
Equipo.belongsTo(Ubicacion, { 
    foreignKey: 'ubicacion_id', 
    as: 'ubicacion' 
});

// Equipo - Mantenimiento (1:N)
Equipo.hasMany(Mantenimiento, { 
    foreignKey: 'equipo_id', 
    as: 'mantenimientos' 
});
Mantenimiento.belongsTo(Equipo, { 
    foreignKey: 'equipo_id', 
    as: 'equipo' 
});

// Usuario - Mantenimiento (1:N) - Técnico
Usuario.hasMany(Mantenimiento, { 
    foreignKey: 'tecnico_id', 
    as: 'mantenimientosRealizados' 
});
Mantenimiento.belongsTo(Usuario, { 
    foreignKey: 'tecnico_id', 
    as: 'tecnico' 
});

// Equipo - Movimiento (1:N)
Equipo.hasMany(Movimiento, { 
    foreignKey: 'equipo_id', 
    as: 'movimientos' 
});
Movimiento.belongsTo(Equipo, { 
    foreignKey: 'equipo_id', 
    as: 'equipo' 
});

// Usuario - Movimiento (1:N) - Responsable
Usuario.hasMany(Movimiento, { 
    foreignKey: 'responsable_id', 
    as: 'movimientosResponsable' 
});
Movimiento.belongsTo(Usuario, { 
    foreignKey: 'responsable_id', 
    as: 'responsable' 
});

// Ubicacion - Movimiento (1:N) - Origen
Ubicacion.hasMany(Movimiento, { 
    foreignKey: 'ubicacion_origen_id', 
    as: 'movimientosOrigen' 
});
Movimiento.belongsTo(Ubicacion, { 
    foreignKey: 'ubicacion_origen_id', 
    as: 'ubicacionOrigen' 
});

// Ubicacion - Movimiento (1:N) - Destino
Ubicacion.hasMany(Movimiento, { 
    foreignKey: 'ubicacion_destino_id', 
    as: 'movimientosDestino' 
});
Movimiento.belongsTo(Ubicacion, { 
    foreignKey: 'ubicacion_destino_id', 
    as: 'ubicacionDestino' 
});

// Usuario - Solicitud (1:N) - Solicitante
Usuario.hasMany(Solicitud, { 
    foreignKey: 'usuario_id', 
    as: 'solicitudesRealizadas' 
});
Solicitud.belongsTo(Usuario, { 
    foreignKey: 'usuario_id', 
    as: 'solicitante' 
});

// Usuario - Solicitud (1:N) - Administrador
Usuario.hasMany(Solicitud, { 
    foreignKey: 'administrador_id', 
    as: 'solicitudesAdministradas' 
});
Solicitud.belongsTo(Usuario, { 
    foreignKey: 'administrador_id', 
    as: 'administrador' 
});

// Equipo - Solicitud (1:N)
Equipo.hasMany(Solicitud, { 
    foreignKey: 'equipo_id', 
    as: 'solicitudes' 
});
Solicitud.belongsTo(Equipo, { 
    foreignKey: 'equipo_id', 
    as: 'equipo' 
});

// Solicitud - AdjuntoSolicitud (1:N)
Solicitud.hasMany(AdjuntoSolicitud, { 
    foreignKey: 'solicitud_id', 
    as: 'adjuntos' 
});
AdjuntoSolicitud.belongsTo(Solicitud, { 
    foreignKey: 'solicitud_id', 
    as: 'solicitud' 
});

// Usuario - AdjuntoSolicitud (1:N)
Usuario.hasMany(AdjuntoSolicitud, { 
    foreignKey: 'usuario_id', 
    as: 'adjuntosSubidos' 
});
AdjuntoSolicitud.belongsTo(Usuario, { 
    foreignKey: 'usuario_id', 
    as: 'usuario' 
});

// Usuario - Alerta (1:N)
Usuario.hasMany(Alerta, { 
    foreignKey: 'usuario_id', 
    as: 'alertas' 
});
Alerta.belongsTo(Usuario, { 
    foreignKey: 'usuario_id', 
    as: 'usuario' 
});

// Usuario - Reporte (1:N)
Usuario.hasMany(Reporte, { 
    foreignKey: 'usuario_id', 
    as: 'reportesGenerados' 
});
Reporte.belongsTo(Usuario, { 
    foreignKey: 'usuario_id', 
    as: 'generador' 
});

module.exports = {
    sequelize,
    Usuario,
    TipoEquipo,
    EstadoEquipo,
    Ubicacion,
    Equipo,
    Mantenimiento,
    Movimiento,
    Solicitud,
    AdjuntoSolicitud,
    Alerta,
    Reporte
}; 