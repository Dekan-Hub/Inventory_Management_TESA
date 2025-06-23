/**
 * @file Archivo central para la gestión de modelos y asociaciones de Sequelize.
 * @description Importa todos los modelos definidos en la aplicación y establece
 * las relaciones entre ellos utilizando Sequelize. Esto asegura que todas las
 * asociaciones estén configuradas correctamente antes de cualquier operación
 * de base de datos que involucre modelos relacionados.
 */

const { sequelize } = require('../config/db'); // Importa la instancia de Sequelize

// --- Importar todos los modelos ---
// Modelos existentes (ya cubiertos)
const Usuario = require('./Usuario');
const TipoEquipo = require('./TipoEquipo');
const EstadoEquipo = require('./EstadoEquipo');
const Ubicacion = require('./Ubicacion');
const Equipo = require('./Equipo');
const Mantenimiento = require('./Mantenimiento');
const Alerta = require('./Alerta'); 
const Movimiento = require('./Movimiento');
const Reporte = require('./Reporte'); 
const Solicitud = require('./Solicitud'); 


// --- Definir Asociaciones entre Modelos ---
// Una vez que todos los modelos han sido importados, se definen las relaciones
// utilizando los métodos `hasMany` (tiene muchos) y `belongsTo` (pertenece a).

// Relación entre Usuario y Equipo
Usuario.hasMany(Equipo, { foreignKey: 'id_usuario_asignado', as: 'equiposAsignados' });
Equipo.belongsTo(Usuario, { foreignKey: 'id_usuario_asignado', as: 'usuarioAsignado' });

// Relación entre TipoEquipo y Equipo
TipoEquipo.hasMany(Equipo, { foreignKey: 'id_tipo_equipo', as: 'equipos' });
Equipo.belongsTo(TipoEquipo, { foreignKey: 'id_tipo_equipo', as: 'tipo' });

// Relación entre EstadoEquipo y Equipo
EstadoEquipo.hasMany(Equipo, { foreignKey: 'id_estado_equipo', as: 'equipos' });
Equipo.belongsTo(EstadoEquipo, { foreignKey: 'id_estado_equipo', as: 'estado' });

// Relación entre Ubicacion y Equipo
Ubicacion.hasMany(Equipo, { foreignKey: 'id_ubicacion', as: 'equipos' });
Equipo.belongsTo(Ubicacion, { foreignKey: 'id_ubicacion', as: 'ubicacion' });

// Relación entre Equipo y Mantenimiento
Equipo.hasMany(Mantenimiento, { foreignKey: 'id_equipo', as: 'mantenimientos' });
Mantenimiento.belongsTo(Equipo, { foreignKey: 'id_equipo', as: 'equipo' });

// Relación entre Usuario y Mantenimiento
Usuario.hasMany(Mantenimiento, { foreignKey: 'id_tecnico', as: 'mantenimientosRealizados' });
Mantenimiento.belongsTo(Usuario, { foreignKey: 'id_tecnico', as: 'tecnico' });


// --- NUEVAS ASOCIACIONES (basadas en los modelos recién añadidos) ---

// Relación entre Usuario y Alerta
// Un Usuario puede ser el destinatario de muchas Alertas.
Usuario.hasMany(Alerta, { foreignKey: 'id_usuario_destino', as: 'alertasRecibidas' }); 
// Una Alerta pertenece a un Usuario (su destinatario).
Alerta.belongsTo(Usuario, { foreignKey: 'id_usuario_destino', as: 'destinatario' }); 

// Relación entre Equipo y Movimiento
// Un Equipo puede tener muchos registros de Movimiento.
Equipo.hasMany(Movimiento, { foreignKey: 'id_equipo', as: 'historialMovimientos' }); 
// Un Movimiento pertenece a un Equipo.
Movimiento.belongsTo(Equipo, { foreignKey: 'id_equipo', as: 'equipo' }); 

// Relación entre Usuario y Movimiento (para el usuario que realizó el movimiento)
// Un Usuario puede realizar muchos Movimientos de Equipo.
Usuario.hasMany(Movimiento, { foreignKey: 'id_usuario_realiza_movimiento', as: 'movimientosRealizados' });
// Un Movimiento fue realizado por un Usuario.
Movimiento.belongsTo(Usuario, { foreignKey: 'id_usuario_realiza_movimiento', as: 'usuarioRealizaMovimiento' }); 

// Relación entre Usuario y Movimiento (para el usuario anterior/actual del equipo)
// Un Usuario puede ser el Usuario anterior/actual de muchos Movimientos de Equipo.
Usuario.hasMany(Movimiento, { foreignKey: 'id_usuario_anterior', as: 'movimientosComoAnterior' }); 
Movimiento.belongsTo(Usuario, { foreignKey: 'id_usuario_anterior', as: 'usuarioAnterior' }); 
Usuario.hasMany(Movimiento, { foreignKey: 'id_usuario_actual', as: 'movimientosComoActual' }); 
Movimiento.belongsTo(Usuario, { foreignKey: 'id_usuario_actual', as: 'usuarioActual' }); 

// Relación entre Ubicacion y Movimiento (para la ubicación anterior/actual del equipo)
// Una Ubicación puede ser la Ubicación anterior/actual en muchos Movimientos de Equipo.
Ubicacion.hasMany(Movimiento, { foreignKey: 'id_ubicacion_anterior', as: 'movimientosDesdeAqui' }); 
Movimiento.belongsTo(Ubicacion, { foreignKey: 'id_ubicacion_anterior', as: 'ubicacionAnterior' });
Ubicacion.hasMany(Movimiento, { foreignKey: 'id_ubicacion_actual', as: 'movimientosHaciaAqui' });
Movimiento.belongsTo(Ubicacion, { foreignKey: 'id_ubicacion_actual', as: 'ubicacionActual' }); 


// Relación entre Usuario y Reporte
// Un Usuario puede generar muchos Reportes.
Usuario.hasMany(Reporte, { foreignKey: 'id_usuario_genera', as: 'reportesGenerados' }); 
// Un Reporte fue generado por un Usuario.
Reporte.belongsTo(Usuario, { foreignKey: 'id_usuario_genera', as: 'generador' }); 


// Relación entre Usuario y Solicitud (solicitante y resolutor)
// Un Usuario puede realizar muchas Solicitudes.
Usuario.hasMany(Solicitud, { foreignKey: 'id_usuario_solicitante', as: 'solicitudesRealizadas' }); 
// Una Solicitud pertenece a un Usuario (el solicitante).
Solicitud.belongsTo(Usuario, { foreignKey: 'id_usuario_solicitante', as: 'solicitante' }); 

// Un Usuario puede resolver muchas Solicitudes.
Usuario.hasMany(Solicitud, { foreignKey: 'id_usuario_resolutor', as: 'solicitudesResueltas' }); 
// Una Solicitud puede ser resuelta por un Usuario (el resolutor).
Solicitud.belongsTo(Usuario, { foreignKey: 'id_usuario_resolutor', as: 'resolutor' }); 

// Relación entre Equipo y Solicitud
// Un Equipo puede ser objeto de muchas Solicitudes (ej. solicitud de mantenimiento para un equipo específico).
Equipo.hasMany(Solicitud, { foreignKey: 'id_equipo_solicitado', as: 'solicitudesRecibidas' }); 
// Una Solicitud puede referirse a un Equipo específico.
Solicitud.belongsTo(Equipo, { foreignKey: 'id_equipo_solicitado', as: 'equipoSolicitado' });


/**
 * @exports {object} module.exports - Exporta la instancia de Sequelize y todos los modelos.
 * Esto permite que otros módulos importen todos los modelos y su configuración de relaciones
 * desde un único punto.
 */
module.exports = {
  sequelize,
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