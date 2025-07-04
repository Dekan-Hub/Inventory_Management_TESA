-- =====================================================
-- SISTEMA DE GESTIÓN DE INVENTARIOS TECNOLÓGICOS
-- Base de datos: inventory_management
-- =====================================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS inventory_management;
USE inventory_management;

-- =====================================================
-- TABLA: usuarios
-- Descripción: Almacena información de todos los usuarios del sistema
-- =====================================================
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('administrador', 'tecnico', 'usuario') NOT NULL DEFAULT 'usuario',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- TABLA: tipo_equipo
-- Descripción: Catálogo de tipos de equipos tecnológicos
-- =====================================================
CREATE TABLE tipo_equipo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- TABLA: estado_equipo
-- Descripción: Estados posibles de un equipo
-- =====================================================
CREATE TABLE estado_equipo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estado VARCHAR(50) NOT NULL,
    descripcion TEXT,
    color VARCHAR(20) DEFAULT '#6B7280'
);

-- =====================================================
-- TABLA: ubicaciones
-- Descripción: Ubicaciones físicas donde se encuentran los equipos
-- =====================================================
CREATE TABLE ubicaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    edificio VARCHAR(100) NOT NULL,
    sala VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- TABLA: equipos
-- Descripción: Equipos tecnológicos del inventario
-- =====================================================
CREATE TABLE equipos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    numero_serie VARCHAR(100) UNIQUE NOT NULL,
    modelo VARCHAR(100),
    marca VARCHAR(100),
    observaciones TEXT,
    fecha_adquisicion DATE,
    costo_adquisicion DECIMAL(10,2),
    tipo_equipo_id INT NOT NULL,
    estado_id INT NOT NULL,
    ubicacion_id INT NOT NULL,
    usuario_asignado_id INT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_equipo_id) REFERENCES tipo_equipo(id),
    FOREIGN KEY (estado_id) REFERENCES estado_equipo(id),
    FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones(id),
    FOREIGN KEY (usuario_asignado_id) REFERENCES usuarios(id)
);

-- =====================================================
-- TABLA: mantenimientos
-- Descripción: Registro de mantenimientos realizados a los equipos
-- =====================================================
CREATE TABLE mantenimientos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipo_id INT NOT NULL,
    tipo_mantenimiento ENUM('preventivo', 'correctivo', 'calibracion') NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_mantenimiento DATE NOT NULL,
    tecnico_id INT NOT NULL,
    costo DECIMAL(10,2),
    observaciones TEXT,
    estado ENUM('programado', 'en_proceso', 'completado', 'cancelado') DEFAULT 'programado',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
);

-- =====================================================
-- TABLA: movimientos
-- Descripción: Registro de movimientos de equipos entre ubicaciones
-- =====================================================
CREATE TABLE movimientos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipo_id INT NOT NULL,
    ubicacion_origen_id INT NOT NULL,
    ubicacion_destino_id INT NOT NULL,
    fecha_movimiento DATE NOT NULL,
    responsable_id INT NOT NULL,
    motivo TEXT NOT NULL,
    estado ENUM('pendiente', 'aprobado', 'rechazado', 'completado') DEFAULT 'pendiente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id),
    FOREIGN KEY (ubicacion_origen_id) REFERENCES ubicaciones(id),
    FOREIGN KEY (ubicacion_destino_id) REFERENCES ubicaciones(id),
    FOREIGN KEY (responsable_id) REFERENCES usuarios(id)
);

-- =====================================================
-- TABLA: solicitudes
-- Descripción: Solicitudes de equipos o servicios por parte de usuarios
-- =====================================================
CREATE TABLE solicitudes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo_solicitud ENUM('nuevo_equipo', 'mantenimiento', 'movimiento', 'otro') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    equipo_id INT,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP NULL,
    estado ENUM('pendiente', 'aprobada', 'rechazada', 'en_proceso', 'completada') DEFAULT 'pendiente',
    respuesta TEXT,
    administrador_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (equipo_id) REFERENCES equipos(id),
    FOREIGN KEY (administrador_id) REFERENCES usuarios(id)
);

-- =====================================================
-- TABLA: adjuntos_solicitudes
-- Descripción: Archivos adjuntos de las solicitudes
-- =====================================================
CREATE TABLE adjuntos_solicitudes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    solicitud_id INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    nombre_guardado VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tipo_archivo VARCHAR(100),
    tamano_bytes INT,
    descripcion TEXT,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NOT NULL,
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_solicitud_id (solicitud_id),
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_fecha_subida (fecha_subida)
);

-- =====================================================
-- TABLA: alertas
-- Descripción: Sistema de alertas y notificaciones
-- =====================================================
CREATE TABLE alertas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo_alerta ENUM('mantenimiento', 'movimiento', 'solicitud', 'sistema') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leida BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =====================================================
-- TABLA: reportes
-- Descripción: Reportes generados del sistema
-- =====================================================
CREATE TABLE reportes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo_reporte ENUM('inventario', 'mantenimientos', 'movimientos', 'solicitudes', 'personalizado') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    parametros JSON,
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_generador_id INT NOT NULL,
    archivo_path VARCHAR(500),
    FOREIGN KEY (usuario_generador_id) REFERENCES usuarios(id)
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================
CREATE INDEX idx_equipos_tipo ON equipos(tipo_equipo_id);
CREATE INDEX idx_equipos_estado ON equipos(estado_id);
CREATE INDEX idx_equipos_ubicacion ON equipos(ubicacion_id);
CREATE INDEX idx_mantenimientos_equipo ON mantenimientos(equipo_id);
CREATE INDEX idx_mantenimientos_tecnico ON mantenimientos(tecnico_id);
CREATE INDEX idx_movimientos_equipo ON movimientos(equipo_id);
CREATE INDEX idx_solicitudes_usuario ON solicitudes(usuario_id);
CREATE INDEX idx_adjuntos_solicitud ON adjuntos_solicitudes(solicitud_id);
CREATE INDEX idx_adjuntos_usuario ON adjuntos_solicitudes(usuario_id);
CREATE INDEX idx_alertas_usuario ON alertas(usuario_id);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar tipos de equipos
INSERT INTO tipo_equipo (nombre, descripcion) VALUES
('Computadora de Escritorio', 'PC de escritorio para uso administrativo'),
('Laptop', 'Computadora portátil para uso móvil'),
('Proyector', 'Equipo de proyección para aulas'),
('Impresora', 'Equipo de impresión'),
('Tablet', 'Dispositivo táctil portátil'),
('Servidor', 'Equipo servidor para servicios de red');

-- Insertar estados de equipos
INSERT INTO estado_equipo (estado, descripcion, color) VALUES
('Activo', 'Equipo en funcionamiento normal', '#10B981'),
('En Mantenimiento', 'Equipo en proceso de mantenimiento', '#F59E0B'),
('Fuera de Servicio', 'Equipo no funcional', '#EF4444'),
('En Reparación', 'Equipo en proceso de reparación', '#8B5CF6'),
('Obsoleto', 'Equipo obsoleto o descontinuado', '#6B7280');

-- Insertar ubicaciones
INSERT INTO ubicaciones (edificio, sala, descripcion) VALUES
('Edificio A', 'Aula 101', 'Aula de informática principal'),
('Edificio A', 'Aula 102', 'Aula de informática secundaria'),
('Edificio B', 'Oficina Administrativa', 'Oficina de administración'),
('Edificio B', 'Sala de Servidores', 'Sala de equipos servidores'),
('Edificio C', 'Laboratorio 1', 'Laboratorio de ciencias'),
('Edificio C', 'Auditorio', 'Auditorio principal');

-- Insertar usuarios iniciales
INSERT INTO usuarios (nombre, usuario, correo, contraseña, rol) VALUES
('Administrador del Sistema', 'admin', 'admin@instituto.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador'),
('Técnico de Sistemas', 'tecnico', 'tecnico@instituto.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tecnico'),
('Usuario General', 'usuario', 'usuario@instituto.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'usuario');

-- Insertar equipos de ejemplo
INSERT INTO equipos (nombre, numero_serie, modelo, marca, tipo_equipo_id, estado_id, ubicacion_id) VALUES
('PC Administrativa 1', 'PC001-2024', 'OptiPlex 7090', 'Dell', 1, 1, 3),
('Laptop Docente 1', 'LP001-2024', 'ThinkPad T14', 'Lenovo', 2, 1, 1),
('Proyector Aula 101', 'PJ001-2024', 'PowerLite 1781W', 'Epson', 3, 1, 1),
('Impresora Administrativa', 'IMP001-2024', 'LaserJet Pro M404n', 'HP', 4, 1, 3);

-- =====================================================
-- PERMISOS POR ROLES
-- =====================================================

/*
PERMISOS POR ROL:

1. ADMINISTRADOR:
   - Acceso completo a todas las tablas
   - Puede crear, leer, actualizar y eliminar registros
   - Puede gestionar usuarios y roles
   - Puede generar reportes
   - Puede aprobar/rechazar solicitudes

2. TÉCNICO:
   - Acceso a equipos (CRUD)
   - Acceso a mantenimientos (CRUD)
   - Acceso a movimientos (CRUD)
   - Puede ver ubicaciones
   - Puede ver tipos de equipos
   - Puede ver estados de equipos
   - Puede ver sus propias solicitudes
   - Puede ver alertas dirigidas a él

3. USUARIO:
   - Solo puede acceder a solicitudes (crear y ver propias)
   - Puede ver equipos asignados a él
   - Puede ver alertas dirigidas a él
   - No puede modificar equipos, mantenimientos o movimientos
*/

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista para equipos con información completa
CREATE VIEW v_equipos_completos AS
SELECT 
    e.id,
    e.nombre,
    e.numero_serie,
    e.modelo,
    e.marca,
    e.observaciones,
    e.fecha_adquisicion,
    e.costo_adquisicion,
    te.nombre as tipo_equipo,
    ee.estado as estado_equipo,
    ee.color as color_estado,
    CONCAT(u.edificio, ' - ', u.sala) as ubicacion,
    us.nombre as usuario_asignado,
    e.fecha_registro
FROM equipos e
LEFT JOIN tipo_equipo te ON e.tipo_equipo_id = te.id
LEFT JOIN estado_equipo ee ON e.estado_id = ee.id
LEFT JOIN ubicaciones u ON e.ubicacion_id = u.id
LEFT JOIN usuarios us ON e.usuario_asignado_id = us.id;

-- Vista para mantenimientos con información completa
CREATE VIEW v_mantenimientos_completos AS
SELECT 
    m.id,
    e.nombre as equipo,
    e.numero_serie,
    m.tipo_mantenimiento,
    m.descripcion,
    m.fecha_mantenimiento,
    m.costo,
    m.observaciones,
    m.estado,
    u.nombre as tecnico,
    m.fecha_registro
FROM mantenimientos m
JOIN equipos e ON m.equipo_id = e.id
JOIN usuarios u ON m.tecnico_id = u.id;

-- Vista para solicitudes con información completa
CREATE VIEW v_solicitudes_completos AS
SELECT 
    s.id,
    s.tipo_solicitud,
    s.titulo,
    s.descripcion,
    s.fecha_solicitud,
    s.fecha_respuesta,
    s.estado,
    s.respuesta,
    u1.nombre as solicitante,
    u2.nombre as administrador,
    e.nombre as equipo
FROM solicitudes s
JOIN usuarios u1 ON s.usuario_id = u1.id
LEFT JOIN usuarios u2 ON s.administrador_id = u2.id
LEFT JOIN equipos e ON s.equipo_id = e.id; 