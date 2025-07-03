/**
 * @file Seed Data
 * @description Script para poblar la base de datos con datos iniciales
 */

const { Usuario, TipoEquipo, EstadoEquipo, Ubicacion, Equipo } = require('../models');
const bcrypt = require('bcryptjs');

/**
 * @function seedData
 * @description Pobla la base de datos con datos iniciales
 */
const seedData = async () => {
    try {
        console.log('🌱 Iniciando población de datos...');

        // =====================================================
        // CREAR USUARIOS INICIALES
        // =====================================================
        console.log('👥 Creando usuarios iniciales...');

        const usuariosExistentes = await Usuario.count();
        if (usuariosExistentes === 0) {
            const usuarios = [
                {
                    nombre: 'Administrador del Sistema',
                    usuario: 'admin',
                    correo: 'admin@instituto.edu',
                    contraseña: 'Admin123',
                    rol: 'administrador'
                },
                {
                    nombre: 'Técnico de Sistemas',
                    usuario: 'tecnico',
                    correo: 'tecnico@instituto.edu',
                    contraseña: 'Tecnico123',
                    rol: 'tecnico'
                },
                {
                    nombre: 'Usuario General',
                    usuario: 'usuario',
                    correo: 'usuario@instituto.edu',
                    contraseña: 'Usuario123',
                    rol: 'usuario'
                }
            ];

            for (const usuarioData of usuarios) {
                await Usuario.create(usuarioData);
            }
            console.log('✅ Usuarios creados exitosamente');
        } else {
            console.log('ℹ️  Los usuarios ya existen, saltando...');
        }

        // =====================================================
        // CREAR TIPOS DE EQUIPO
        // =====================================================
        console.log('🖥️  Creando tipos de equipo...');

        const tiposExistentes = await TipoEquipo.count();
        if (tiposExistentes === 0) {
            const tiposEquipo = [
                {
                    nombre: 'Computadora de Escritorio',
                    descripcion: 'PC de escritorio para uso administrativo'
                },
                {
                    nombre: 'Laptop',
                    descripcion: 'Computadora portátil para uso móvil'
                },
                {
                    nombre: 'Proyector',
                    descripcion: 'Equipo de proyección para aulas'
                },
                {
                    nombre: 'Impresora',
                    descripcion: 'Equipo de impresión'
                },
                {
                    nombre: 'Tablet',
                    descripcion: 'Dispositivo táctil portátil'
                },
                {
                    nombre: 'Servidor',
                    descripcion: 'Equipo servidor para servicios de red'
                }
            ];

            for (const tipoData of tiposEquipo) {
                await TipoEquipo.create(tipoData);
            }
            console.log('✅ Tipos de equipo creados exitosamente');
        } else {
            console.log('ℹ️  Los tipos de equipo ya existen, saltando...');
        }

        // =====================================================
        // CREAR ESTADOS DE EQUIPO
        // =====================================================
        console.log('📊 Creando estados de equipo...');

        const estadosExistentes = await EstadoEquipo.count();
        if (estadosExistentes === 0) {
            const estadosEquipo = [
                {
                    estado: 'Activo',
                    descripcion: 'Equipo en funcionamiento normal',
                    color: '#10B981'
                },
                {
                    estado: 'En Mantenimiento',
                    descripcion: 'Equipo en proceso de mantenimiento',
                    color: '#F59E0B'
                },
                {
                    estado: 'Fuera de Servicio',
                    descripcion: 'Equipo no funcional',
                    color: '#EF4444'
                },
                {
                    estado: 'En Reparación',
                    descripcion: 'Equipo en proceso de reparación',
                    color: '#8B5CF6'
                },
                {
                    estado: 'Obsoleto',
                    descripcion: 'Equipo obsoleto o descontinuado',
                    color: '#6B7280'
                }
            ];

            for (const estadoData of estadosEquipo) {
                await EstadoEquipo.create(estadoData);
            }
            console.log('✅ Estados de equipo creados exitosamente');
        } else {
            console.log('ℹ️  Los estados de equipo ya existen, saltando...');
        }

        // =====================================================
        // CREAR UBICACIONES
        // =====================================================
        console.log('📍 Creando ubicaciones...');

        const ubicacionesExistentes = await Ubicacion.count();
        if (ubicacionesExistentes === 0) {
            const ubicaciones = [
                {
                    edificio: 'Edificio A',
                    sala: 'Aula 101',
                    descripcion: 'Aula de informática principal'
                },
                {
                    edificio: 'Edificio A',
                    sala: 'Aula 102',
                    descripcion: 'Aula de informática secundaria'
                },
                {
                    edificio: 'Edificio B',
                    sala: 'Oficina Administrativa',
                    descripcion: 'Oficina de administración'
                },
                {
                    edificio: 'Edificio B',
                    sala: 'Sala de Servidores',
                    descripcion: 'Sala de equipos servidores'
                },
                {
                    edificio: 'Edificio C',
                    sala: 'Laboratorio 1',
                    descripcion: 'Laboratorio de ciencias'
                },
                {
                    edificio: 'Edificio C',
                    sala: 'Auditorio',
                    descripcion: 'Auditorio principal'
                }
            ];

            for (const ubicacionData of ubicaciones) {
                await Ubicacion.create(ubicacionData);
            }
            console.log('✅ Ubicaciones creadas exitosamente');
        } else {
            console.log('ℹ️  Las ubicaciones ya existen, saltando...');
        }

        // =====================================================
        // CREAR EQUIPOS DE EJEMPLO
        // =====================================================
        console.log('💻 Creando equipos de ejemplo...');

        const equiposExistentes = await Equipo.count();
        if (equiposExistentes === 0) {
            // Obtener IDs de referencia
            const tipoPC = await TipoEquipo.findOne({ where: { nombre: 'Computadora de Escritorio' } });
            const tipoLaptop = await TipoEquipo.findOne({ where: { nombre: 'Laptop' } });
            const tipoProyector = await TipoEquipo.findOne({ where: { nombre: 'Proyector' } });
            const tipoImpresora = await TipoEquipo.findOne({ where: { nombre: 'Impresora' } });

            const estadoActivo = await EstadoEquipo.findOne({ where: { estado: 'Activo' } });
            const ubicacionAdmin = await Ubicacion.findOne({ where: { sala: 'Oficina Administrativa' } });
            const ubicacionAula101 = await Ubicacion.findOne({ where: { sala: 'Aula 101' } });

            const admin = await Usuario.findOne({ where: { usuario: 'admin' } });
            const tecnico = await Usuario.findOne({ where: { usuario: 'tecnico' } });

            const equipos = [
                {
                    nombre: 'PC Administrativa 1',
                    numero_serie: 'PC001-2024',
                    modelo: 'OptiPlex 7090',
                    marca: 'Dell',
                    observaciones: 'Equipo principal de administración',
                    fecha_adquisicion: '2024-01-15',
                    costo_adquisicion: 2500.00,
                    tipo_equipo_id: tipoPC.id,
                    estado_id: estadoActivo.id,
                    ubicacion_id: ubicacionAdmin.id,
                    usuario_asignado_id: admin.id
                },
                {
                    nombre: 'Laptop Docente 1',
                    numero_serie: 'LP001-2024',
                    modelo: 'ThinkPad T14',
                    marca: 'Lenovo',
                    observaciones: 'Laptop para uso docente',
                    fecha_adquisicion: '2024-02-01',
                    costo_adquisicion: 1800.00,
                    tipo_equipo_id: tipoLaptop.id,
                    estado_id: estadoActivo.id,
                    ubicacion_id: ubicacionAula101.id,
                    usuario_asignado_id: tecnico.id
                },
                {
                    nombre: 'Proyector Aula 101',
                    numero_serie: 'PJ001-2024',
                    modelo: 'PowerLite 1781W',
                    marca: 'Epson',
                    observaciones: 'Proyector para presentaciones',
                    fecha_adquisicion: '2024-01-20',
                    costo_adquisicion: 1200.00,
                    tipo_equipo_id: tipoProyector.id,
                    estado_id: estadoActivo.id,
                    ubicacion_id: ubicacionAula101.id
                },
                {
                    nombre: 'Impresora Administrativa',
                    numero_serie: 'IMP001-2024',
                    modelo: 'LaserJet Pro M404n',
                    marca: 'HP',
                    observaciones: 'Impresora láser para oficina',
                    fecha_adquisicion: '2024-01-10',
                    costo_adquisicion: 800.00,
                    tipo_equipo_id: tipoImpresora.id,
                    estado_id: estadoActivo.id,
                    ubicacion_id: ubicacionAdmin.id
                }
            ];

            for (const equipoData of equipos) {
                await Equipo.create(equipoData);
            }
            console.log('✅ Equipos de ejemplo creados exitosamente');
        } else {
            console.log('ℹ️  Los equipos ya existen, saltando...');
        }

        console.log('🎉 Población de datos completada exitosamente!');
        console.log('\n📋 Credenciales de acceso:');
        console.log('👤 Administrador: admin / Admin123');
        console.log('🔧 Técnico: tecnico / Tecnico123');
        console.log('👥 Usuario: usuario / Usuario123');

    } catch (error) {
        console.error('❌ Error al poblar datos:', error);
        throw error;
    }
};

module.exports = { seedData }; 