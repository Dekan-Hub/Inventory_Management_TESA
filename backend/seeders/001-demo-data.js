'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Usuarios
    const usuarios = [
      {
        nombre: 'Administrador del Sistema Principal',
        usuario: 'admin',
        correo: 'admin@instituto.edu',
        contraseña: await bcrypt.hash('Admin123', 12),
        rol: 'administrador',
        activo: true,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Técnico de Sistemas Especialista',
        usuario: 'tecnico',
        correo: 'tecnico@instituto.edu',
        contraseña: await bcrypt.hash('Tecnico123', 12),
        rol: 'tecnico',
        activo: true,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Usuario General Estándar',
        usuario: 'usuario',
        correo: 'usuario@instituto.edu',
        contraseña: await bcrypt.hash('Usuario123', 12),
        rol: 'usuario',
        activo: true,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    for (const user of usuarios) {
      const exists = await queryInterface.rawSelect('usuarios', {
        where: { usuario: user.usuario }
      }, ['id']);
      if (!exists) {
        await queryInterface.bulkInsert('usuarios', [user], {});
        console.log(`Usuario '${user.usuario}' insertado.`);
      } else {
        console.log(`Usuario '${user.usuario}' ya existe, no se inserta.`);
      }
    }

    // Tipos de equipo
    const tiposEquipo = [
      { nombre: 'Computadora de Escritorio', descripcion: 'PC de escritorio para uso administrativo', activo: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Laptop', descripcion: 'Computadora portátil para uso móvil', activo: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Proyector', descripcion: 'Equipo de proyección para aulas', activo: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Impresora', descripcion: 'Equipo de impresión', activo: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Tablet', descripcion: 'Dispositivo táctil portátil', activo: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Servidor', descripcion: 'Equipo servidor para servicios de red', activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    for (const tipo of tiposEquipo) {
      const exists = await queryInterface.rawSelect('tipo_equipo', {
        where: { nombre: tipo.nombre }
      }, ['id']);
      if (!exists) {
        await queryInterface.bulkInsert('tipo_equipo', [tipo], {});
        console.log(`Tipo de equipo '${tipo.nombre}' insertado.`);
      } else {
        console.log(`Tipo de equipo '${tipo.nombre}' ya existe, no se inserta.`);
      }
    }

    // Estados de equipo
    const estadosEquipo = [
      { estado: 'Activo', descripcion: 'Equipo en funcionamiento normal', color: '#10B981', createdAt: new Date(), updatedAt: new Date() },
      { estado: 'En Mantenimiento', descripcion: 'Equipo en proceso de mantenimiento', color: '#F59E0B', createdAt: new Date(), updatedAt: new Date() },
      { estado: 'Fuera de Servicio', descripcion: 'Equipo no funcional', color: '#EF4444', createdAt: new Date(), updatedAt: new Date() },
      { estado: 'En Reparación', descripcion: 'Equipo en proceso de reparación', color: '#8B5CF6', createdAt: new Date(), updatedAt: new Date() },
      { estado: 'Obsoleto', descripcion: 'Equipo obsoleto o descontinuado', color: '#6B7280', createdAt: new Date(), updatedAt: new Date() }
    ];
    for (const estado of estadosEquipo) {
      const exists = await queryInterface.rawSelect('estado_equipo', {
        where: { estado: estado.estado }
      }, ['id']);
      if (!exists) {
        await queryInterface.bulkInsert('estado_equipo', [estado], {});
        console.log(`Estado de equipo '${estado.estado}' insertado.`);
      } else {
        console.log(`Estado de equipo '${estado.estado}' ya existe, no se inserta.`);
      }
    }

    // Ubicaciones
    const ubicaciones = [
      { edificio: 'Edificio A', sala: 'Aula 101', descripcion: 'Aula de informática principal', activo: true, createdAt: new Date(), updatedAt: new Date() },
      { edificio: 'Edificio A', sala: 'Aula 102', descripcion: 'Aula de informática secundaria', activo: true, createdAt: new Date(), updatedAt: new Date() },
      { edificio: 'Edificio B', sala: 'Oficina Administrativa', descripcion: 'Oficina de administración', activo: true, createdAt: new Date(), updatedAt: new Date() },
      { edificio: 'Edificio B', sala: 'Sala de Servidores', descripcion: 'Sala de equipos servidores', activo: true, createdAt: new Date(), updatedAt: new Date() },
      { edificio: 'Edificio C', sala: 'Laboratorio 1', descripcion: 'Laboratorio de ciencias', activo: true, createdAt: new Date(), updatedAt: new Date() },
      { edificio: 'Edificio C', sala: 'Auditorio', descripcion: 'Auditorio principal', activo: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    for (const ubic of ubicaciones) {
      const exists = await queryInterface.rawSelect('ubicaciones', {
        where: { edificio: ubic.edificio, sala: ubic.sala }
      }, ['id']);
      if (!exists) {
        await queryInterface.bulkInsert('ubicaciones', [ubic], {});
        console.log(`Ubicación '${ubic.edificio} - ${ubic.sala}' insertada.`);
      } else {
        console.log(`Ubicación '${ubic.edificio} - ${ubic.sala}' ya existe, no se inserta.`);
      }
    }

    // Equipos de ejemplo
    const equipos = [
      { nombre: 'PC Administrativa 001', numero_serie: 'PC-ADM-001-2024', modelo: 'OptiPlex 7090', marca: 'Dell', observaciones: 'Computadora para oficina administrativa', fecha_adquisicion: '2024-01-15', costo_adquisicion: 2500.00, tipo_equipo_id: 1, estado_id: 1, ubicacion_id: 3, usuario_asignado_id: 1, fecha_registro: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Laptop Técnico 001', numero_serie: 'LAP-TEC-001-2024', modelo: 'ThinkPad T14', marca: 'Lenovo', observaciones: 'Laptop para trabajo técnico móvil', fecha_adquisicion: '2024-02-20', costo_adquisicion: 3200.00, tipo_equipo_id: 2, estado_id: 1, ubicacion_id: 4, usuario_asignado_id: 2, fecha_registro: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Proyector Aula 101', numero_serie: 'PROJ-A101-2024', modelo: 'PowerLite 1781W', marca: 'Epson', observaciones: 'Proyector para presentaciones en aula', fecha_adquisicion: '2024-03-10', costo_adquisicion: 1800.00, tipo_equipo_id: 3, estado_id: 1, ubicacion_id: 1, usuario_asignado_id: null, fecha_registro: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Impresora Multifuncional', numero_serie: 'IMP-MF-001-2024', modelo: 'LaserJet Pro M404n', marca: 'HP', observaciones: 'Impresora láser multifuncional', fecha_adquisicion: '2024-01-05', costo_adquisicion: 450.00, tipo_equipo_id: 4, estado_id: 2, ubicacion_id: 3, usuario_asignado_id: null, fecha_registro: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Tablet Educativa 001', numero_serie: 'TAB-EDU-001-2024', modelo: 'iPad Air', marca: 'Apple', observaciones: 'Tablet para uso educativo', fecha_adquisicion: '2024-04-15', costo_adquisicion: 800.00, tipo_equipo_id: 5, estado_id: 1, ubicacion_id: 5, usuario_asignado_id: 3, fecha_registro: new Date(), createdAt: new Date(), updatedAt: new Date() }
    ];
    for (const equipo of equipos) {
      const exists = await queryInterface.rawSelect('equipos', {
        where: { numero_serie: equipo.numero_serie }
      }, ['id']);
      if (!exists) {
        await queryInterface.bulkInsert('equipos', [equipo], {});
        console.log(`Equipo '${equipo.nombre}' insertado.`);
      } else {
        console.log(`Equipo '${equipo.nombre}' ya existe, no se inserta.`);
      }
    }

    // Mantenimientos de ejemplo
    const mantenimientos = [
      {
        tipo_mantenimiento: 'preventivo',
        descripcion: 'Limpieza y actualización de software en PC administrativa',
        fecha_inicio: new Date('2024-06-15'),
        fecha_fin: new Date('2024-06-16'),
        costo: 150.00,
        estado: 'completado',
        observaciones: 'Mantenimiento rutinario realizado exitosamente',
        equipo_id: 1,
        tecnico_id: 2,
        solicitante_id: 1,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tipo_mantenimiento: 'correctivo',
        descripcion: 'Reparación de impresora con problemas de alimentación de papel',
        fecha_inicio: new Date('2024-06-20'),
        fecha_fin: null,
        costo: 200.00,
        estado: 'en_proceso',
        observaciones: 'Esperando repuestos para completar la reparación',
        equipo_id: 4,
        tecnico_id: 2,
        solicitante_id: 3,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tipo_mantenimiento: 'emergencia',
        descripcion: 'Reparación urgente de proyector que no enciende',
        fecha_inicio: new Date('2024-06-25'),
        fecha_fin: new Date('2024-06-25'),
        costo: 300.00,
        estado: 'completado',
        observaciones: 'Cambio de lámpara del proyector',
        equipo_id: 3,
        tecnico_id: 2,
        solicitante_id: 1,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    for (const mantenimiento of mantenimientos) {
      const exists = await queryInterface.rawSelect('mantenimientos', {
        where: { 
          equipo_id: mantenimiento.equipo_id,
          fecha_inicio: mantenimiento.fecha_inicio,
          tipo_mantenimiento: mantenimiento.tipo_mantenimiento
        }
      }, ['id']);
      if (!exists) {
        await queryInterface.bulkInsert('mantenimientos', [mantenimiento], {});
        console.log(`Mantenimiento para equipo ID ${mantenimiento.equipo_id} insertado.`);
      } else {
        console.log(`Mantenimiento para equipo ID ${mantenimiento.equipo_id} ya existe, no se inserta.`);
      }
    }

    // Movimientos de ejemplo
    const movimientos = [
      {
        tipo_movimiento: 'asignacion',
        fecha_movimiento: new Date('2024-06-10'),
        motivo: 'Asignación de laptop para trabajo técnico',
        observaciones: 'Laptop asignada al técnico para mantenimientos móviles',
        equipo_id: 2,
        ubicacion_origen_id: 4,
        ubicacion_destino_id: 4,
        usuario_origen_id: null,
        usuario_destino_id: 2,
        autorizado_por_id: 1,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tipo_movimiento: 'traslado',
        fecha_movimiento: new Date('2024-06-12'),
        motivo: 'Traslado de proyector para presentación en auditorio',
        observaciones: 'Proyector movido temporalmente para evento especial',
        equipo_id: 3,
        ubicacion_origen_id: 1,
        ubicacion_destino_id: 6,
        usuario_origen_id: null,
        usuario_destino_id: null,
        autorizado_por_id: 1,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tipo_movimiento: 'devolucion',
        fecha_movimiento: new Date('2024-06-14'),
        motivo: 'Devolución de proyector a su ubicación original',
        observaciones: 'Proyector devuelto después del evento',
        equipo_id: 3,
        ubicacion_origen_id: 6,
        ubicacion_destino_id: 1,
        usuario_origen_id: null,
        usuario_destino_id: null,
        autorizado_por_id: 1,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    for (const movimiento of movimientos) {
      const exists = await queryInterface.rawSelect('movimientos', {
        where: { 
          equipo_id: movimiento.equipo_id,
          fecha_movimiento: movimiento.fecha_movimiento,
          tipo_movimiento: movimiento.tipo_movimiento
        }
      }, ['id']);
      if (!exists) {
        await queryInterface.bulkInsert('movimientos', [movimiento], {});
        console.log(`Movimiento de equipo ID ${movimiento.equipo_id} insertado.`);
      } else {
        console.log(`Movimiento de equipo ID ${movimiento.equipo_id} ya existe, no se inserta.`);
      }
    }

    // Solicitudes de ejemplo
    const solicitudes = [
      {
        tipo_solicitud: 'mantenimiento',
        titulo: 'Solicitud de mantenimiento preventivo',
        descripcion: 'Necesito que se realice mantenimiento preventivo en la PC administrativa',
        prioridad: 'media',
        estado: 'aprobada',
        fecha_solicitud: new Date('2024-06-08'),
        fecha_resolucion: new Date('2024-06-15'),
        observaciones: 'Solicitud aprobada y programada',
        solicitante_id: 1,
        asignado_a_id: 2,
        equipo_id: 1,
        ubicacion_id: 3,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tipo_solicitud: 'equipo',
        titulo: 'Solicitud de nueva impresora',
        descripcion: 'Se requiere una nueva impresora para el laboratorio',
        prioridad: 'alta',
        estado: 'en_revision',
        fecha_solicitud: new Date('2024-06-18'),
        fecha_resolucion: null,
        observaciones: 'En revisión de presupuesto',
        solicitante_id: 3,
        asignado_a_id: 1,
        equipo_id: null,
        ubicacion_id: 5,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tipo_solicitud: 'movimiento',
        titulo: 'Solicitud de traslado de equipo',
        descripcion: 'Necesito trasladar la tablet al auditorio para presentación',
        prioridad: 'baja',
        estado: 'pendiente',
        fecha_solicitud: new Date('2024-06-20'),
        fecha_resolucion: null,
        observaciones: 'Pendiente de autorización',
        solicitante_id: 3,
        asignado_a_id: null,
        equipo_id: 5,
        ubicacion_id: 6,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    for (const solicitud of solicitudes) {
      const exists = await queryInterface.rawSelect('solicitudes', {
        where: { 
          solicitante_id: solicitud.solicitante_id,
          fecha_solicitud: solicitud.fecha_solicitud,
          titulo: solicitud.titulo
        }
      }, ['id']);
      if (!exists) {
        await queryInterface.bulkInsert('solicitudes', [solicitud], {});
        console.log(`Solicitud '${solicitud.titulo}' insertada.`);
      } else {
        console.log(`Solicitud '${solicitud.titulo}' ya existe, no se inserta.`);
      }
    }

    // Alertas de ejemplo
    const alertas = [
      {
        tipo_alerta: 'mantenimiento',
        titulo: 'Mantenimiento programado',
        mensaje: 'Se ha programado mantenimiento preventivo para la PC administrativa',
        prioridad: 'media',
        estado: 'activa',
        fecha_generacion: new Date('2024-06-08'),
        fecha_resolucion: new Date('2024-06-15'),
        fecha_vencimiento: new Date('2024-06-30'),
        equipo_id: 1,
        mantenimiento_id: 1,
        solicitud_id: 1,
        usuario_destino_id: 1,
        generado_por_id: 2,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tipo_alerta: 'equipo_fuera_servicio',
        titulo: 'Equipo en mantenimiento',
        mensaje: 'La impresora multifuncional está en proceso de reparación',
        prioridad: 'alta',
        estado: 'activa',
        fecha_generacion: new Date('2024-06-20'),
        fecha_resolucion: null,
        fecha_vencimiento: new Date('2024-07-20'),
        equipo_id: 4,
        mantenimiento_id: 2,
        solicitud_id: null,
        usuario_destino_id: 3,
        generado_por_id: 2,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tipo_alerta: 'solicitud_urgente',
        titulo: 'Solicitud urgente pendiente',
        mensaje: 'Hay una solicitud de nueva impresora que requiere atención inmediata',
        prioridad: 'alta',
        estado: 'activa',
        fecha_generacion: new Date('2024-06-18'),
        fecha_resolucion: null,
        fecha_vencimiento: new Date('2024-06-25'),
        equipo_id: null,
        mantenimiento_id: null,
        solicitud_id: 2,
        usuario_destino_id: 1,
        generado_por_id: 3,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    for (const alerta of alertas) {
      const exists = await queryInterface.rawSelect('alertas', {
        where: { 
          tipo_alerta: alerta.tipo_alerta,
          fecha_generacion: alerta.fecha_generacion,
          titulo: alerta.titulo
        }
      }, ['id']);
      if (!exists) {
        await queryInterface.bulkInsert('alertas', [alerta], {});
        console.log(`Alerta '${alerta.titulo}' insertada.`);
      } else {
        console.log(`Alerta '${alerta.titulo}' ya existe, no se inserta.`);
      }
    }

    // Reportes de ejemplo
    const reportes = [
      {
        tipo_reporte: 'inventario',
        titulo: 'Reporte de Inventario General',
        descripcion: 'Reporte completo del inventario de equipos tecnológicos',
        formato: 'pdf',
        parametros: JSON.stringify({ fecha_inicio: '2024-01-01', fecha_fin: '2024-12-31' }),
        ruta_archivo: '/reports/inventario_general_2024.pdf',
        tamano_archivo: 1024000,
        estado: 'completado',
        fecha_generacion: new Date('2024-06-01'),
        fecha_completado: new Date('2024-06-01'),
        fecha_expiracion: new Date('2024-12-31'),
        error_mensaje: null,
        usuario_id: 1,
        equipo_id: null,
        ubicacion_id: null,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tipo_reporte: 'mantenimiento',
        titulo: 'Reporte de Mantenimientos del Mes',
        descripcion: 'Reporte de mantenimientos realizados en junio 2024',
        formato: 'excel',
        parametros: JSON.stringify({ mes: 6, año: 2024 }),
        ruta_archivo: '/reports/mantenimientos_junio_2024.xlsx',
        tamano_archivo: 512000,
        estado: 'completado',
        fecha_generacion: new Date('2024-06-30'),
        fecha_completado: new Date('2024-06-30'),
        fecha_expiracion: new Date('2024-12-31'),
        error_mensaje: null,
        usuario_id: 2,
        equipo_id: null,
        ubicacion_id: null,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        tipo_reporte: 'movimientos',
        titulo: 'Reporte de Movimientos de Equipos',
        descripcion: 'Reporte de movimientos realizados en el último mes',
        formato: 'pdf',
        parametros: JSON.stringify({ dias: 30 }),
        ruta_archivo: null,
        tamano_archivo: null,
        estado: 'generando',
        fecha_generacion: new Date(),
        fecha_completado: null,
        fecha_expiracion: new Date('2024-07-31'),
        error_mensaje: null,
        usuario_id: 1,
        equipo_id: null,
        ubicacion_id: null,
        fecha_registro: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    for (const reporte of reportes) {
      const exists = await queryInterface.rawSelect('reportes', {
        where: { 
          tipo_reporte: reporte.tipo_reporte,
          fecha_generacion: reporte.fecha_generacion,
          titulo: reporte.titulo
        }
      }, ['id']);
      if (!exists) {
        await queryInterface.bulkInsert('reportes', [reporte], {});
        console.log(`Reporte '${reporte.titulo}' insertado.`);
      } else {
        console.log(`Reporte '${reporte.titulo}' ya existe, no se inserta.`);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('reportes', null, {});
    await queryInterface.bulkDelete('alertas', null, {});
    await queryInterface.bulkDelete('solicitudes', null, {});
    await queryInterface.bulkDelete('movimientos', null, {});
    await queryInterface.bulkDelete('mantenimientos', null, {});
    await queryInterface.bulkDelete('equipos', null, {});
    await queryInterface.bulkDelete('ubicaciones', null, {});
    await queryInterface.bulkDelete('estado_equipo', null, {});
    await queryInterface.bulkDelete('tipo_equipo', null, {});
    await queryInterface.bulkDelete('usuarios', null, {});
  }
}; 