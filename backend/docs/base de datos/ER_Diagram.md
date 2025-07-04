# Diagrama Entidad-Relación - Sistema de Gestión de Inventarios Tecnológicos

## Descripción General
Este documento describe el modelo de datos del sistema de gestión de inventarios tecnológicos para el Instituto San Antonio.

## Entidades Principales

### 1. USUARIOS
**Descripción**: Almacena información de todos los usuarios del sistema
**Atributos Clave**:
- `id` (PK): Identificador único del usuario
- `usuario` (UK): Nombre de usuario único para login
- `correo` (UK): Correo electrónico único
- `contraseña`: Contraseña encriptada
- `rol`: Tipo de usuario (administrador, tecnico, usuario)
- `nombre`: Nombre completo del usuario
- `fecha_registro`: Fecha de registro en el sistema
- `activo`: Estado del usuario

### 2. TIPO_EQUIPO
**Descripción**: Catálogo de tipos de equipos tecnológicos
**Atributos Clave**:
- `id` (PK): Identificador único del tipo
- `nombre`: Nombre del tipo de equipo
- `descripcion`: Descripción detallada
- `activo`: Estado del tipo de equipo

### 3. ESTADO_EQUIPO
**Descripción**: Estados posibles de un equipo
**Atributos Clave**:
- `id` (PK): Identificador único del estado
- `estado`: Nombre del estado
- `descripcion`: Descripción del estado
- `color`: Color para representación visual

### 4. UBICACIONES
**Descripción**: Ubicaciones físicas donde se encuentran los equipos
**Atributos Clave**:
- `id` (PK): Identificador único de la ubicación
- `edificio`: Nombre del edificio
- `sala`: Nombre de la sala
- `descripcion`: Descripción de la ubicación
- `activo`: Estado de la ubicación

### 5. EQUIPOS
**Descripción**: Equipos tecnológicos del inventario
**Atributos Clave**:
- `id` (PK): Identificador único del equipo
- `numero_serie` (UK): Número de serie único del equipo
- `nombre`: Nombre descriptivo del equipo
- `modelo`: Modelo del equipo
- `marca`: Marca del equipo
- `observaciones`: Observaciones adicionales
- `fecha_adquisicion`: Fecha de adquisición
- `costo_adquisicion`: Costo de adquisición
- `fecha_registro`: Fecha de registro en el sistema

**Claves Foráneas**:
- `tipo_equipo_id` → TIPO_EQUIPO(id)
- `estado_id` → ESTADO_EQUIPO(id)
- `ubicacion_id` → UBICACIONES(id)
- `usuario_asignado_id` → USUARIOS(id)

### 6. MANTENIMIENTOS
**Descripción**: Registro de mantenimientos realizados a los equipos
**Atributos Clave**:
- `id` (PK): Identificador único del mantenimiento
- `tipo_mantenimiento`: Tipo (preventivo, correctivo, calibracion)
- `descripcion`: Descripción del mantenimiento
- `fecha_mantenimiento`: Fecha del mantenimiento
- `costo`: Costo del mantenimiento
- `observaciones`: Observaciones adicionales
- `estado`: Estado del mantenimiento
- `fecha_registro`: Fecha de registro

**Claves Foráneas**:
- `equipo_id` → EQUIPOS(id)
- `tecnico_id` → USUARIOS(id)

### 7. MOVIMIENTOS
**Descripción**: Registro de movimientos de equipos entre ubicaciones
**Atributos Clave**:
- `id` (PK): Identificador único del movimiento
- `fecha_movimiento`: Fecha del movimiento
- `motivo`: Motivo del movimiento
- `estado`: Estado del movimiento
- `fecha_registro`: Fecha de registro

**Claves Foráneas**:
- `equipo_id` → EQUIPOS(id)
- `ubicacion_origen_id` → UBICACIONES(id)
- `ubicacion_destino_id` → UBICACIONES(id)
- `responsable_id` → USUARIOS(id)

### 8. SOLICITUDES
**Descripción**: Solicitudes de equipos o servicios por parte de usuarios
**Atributos Clave**:
- `id` (PK): Identificador único de la solicitud
- `tipo_solicitud`: Tipo (nuevo_equipo, mantenimiento, movimiento, otro)
- `titulo`: Título de la solicitud
- `descripcion`: Descripción detallada
- `fecha_solicitud`: Fecha de la solicitud
- `fecha_respuesta`: Fecha de respuesta
- `estado`: Estado de la solicitud
- `respuesta`: Respuesta del administrador

**Claves Foráneas**:
- `usuario_id` → USUARIOS(id)
- `equipo_id` → EQUIPOS(id)
- `administrador_id` → USUARIOS(id)

### 9. ADJUNTOS_SOLICITUDES
**Descripción**: Archivos adjuntos de las solicitudes
**Atributos Clave**:
- `id` (PK): Identificador único del adjunto
- `solicitud_id` (FK): ID de la solicitud
- `nombre_archivo`: Nombre original del archivo
- `nombre_guardado`: Nombre del archivo guardado en el servidor
- `ruta_archivo`: Ruta completa del archivo
- `tipo_archivo`: Tipo MIME del archivo
- `tamano_bytes`: Tamaño del archivo en bytes
- `descripcion`: Descripción opcional del adjunto
- `fecha_subida`: Fecha de subida del archivo
- `usuario_id` (FK): ID del usuario que subió el archivo

**Claves Foráneas**:
- `solicitud_id` → SOLICITUDES(id) ON DELETE CASCADE
- `usuario_id` → USUARIOS(id) ON DELETE CASCADE

### 10. ALERTAS
**Descripción**: Sistema de alertas y notificaciones
**Atributos Clave**:
- `id` (PK): Identificador único de la alerta
- `tipo_alerta`: Tipo (mantenimiento, movimiento, solicitud, sistema)
- `titulo`: Título de la alerta
- `mensaje`: Mensaje de la alerta
- `fecha_envio`: Fecha de envío
- `leida`: Estado de lectura

**Claves Foráneas**:
- `usuario_id` → USUARIOS(id)

### 11. REPORTES
**Descripción**: Reportes generados del sistema
**Atributos Clave**:
- `id` (PK): Identificador único del reporte
- `tipo_reporte`: Tipo de reporte
- `titulo`: Título del reporte
- `descripcion`: Descripción del reporte
- `parametros`: Parámetros del reporte (JSON)
- `fecha_generacion`: Fecha de generación
- `archivo_path`: Ruta del archivo generado

**Claves Foráneas**:
- `usuario_generador_id` → USUARIOS(id)

## Relaciones Principales

### Relaciones 1:N
1. **USUARIOS** → **EQUIPOS** (usuario_asignado_id)
2. **USUARIOS** → **MANTENIMIENTOS** (tecnico_id)
3. **USUARIOS** → **MOVIMIENTOS** (responsable_id)
4. **USUARIOS** → **SOLICITUDES** (usuario_id, administrador_id)
5. **USUARIOS** → **ALERTAS** (usuario_id)
6. **USUARIOS** → **REPORTES** (usuario_generador_id)

7. **TIPO_EQUIPO** → **EQUIPOS** (tipo_equipo_id)
8. **ESTADO_EQUIPO** → **EQUIPOS** (estado_id)
9. **UBICACIONES** → **EQUIPOS** (ubicacion_id)
10. **UBICACIONES** → **MOVIMIENTOS** (ubicacion_origen_id, ubicacion_destino_id)

11. **EQUIPOS** → **MANTENIMIENTOS** (equipo_id)
12. **EQUIPOS** → **MOVIMIENTOS** (equipo_id)
13. **EQUIPOS** → **SOLICITUDES** (equipo_id)
14. **SOLICITUDES** → **ADJUNTOS_SOLICITUDES** (solicitud_id)
15. **USUARIOS** → **ADJUNTOS_SOLICITUDES** (usuario_id)

## Permisos por Roles

### Administrador
- Acceso completo a todas las entidades
- CRUD completo en todas las tablas
- Gestión de usuarios y roles
- Generación de reportes
- Aprobación/rechazo de solicitudes

### Técnico
- CRUD en EQUIPOS, MANTENIMIENTOS, MOVIMIENTOS
- Lectura en UBICACIONES, TIPO_EQUIPO, ESTADO_EQUIPO
- Lectura de sus propias SOLICITUDES
- Lectura de sus ALERTAS

### Usuario
- CRUD en sus propias SOLICITUDES
- Lectura de EQUIPOS asignados
- Lectura de sus ALERTAS
- Sin acceso a MANTENIMIENTOS, MOVIMIENTOS

## Índices de Optimización
- `idx_equipos_tipo`: Optimiza consultas por tipo de equipo
- `idx_equipos_estado`: Optimiza consultas por estado
- `idx_equipos_ubicacion`: Optimiza consultas por ubicación
- `idx_mantenimientos_equipo`: Optimiza consultas de mantenimientos por equipo
- `idx_mantenimientos_tecnico`: Optimiza consultas de mantenimientos por técnico
- `idx_movimientos_equipo`: Optimiza consultas de movimientos por equipo
- `idx_solicitudes_usuario`: Optimiza consultas de solicitudes por usuario
- `idx_adjuntos_solicitud`: Optimiza consultas de adjuntos por solicitud
- `idx_adjuntos_usuario`: Optimiza consultas de adjuntos por usuario
- `idx_alertas_usuario`: Optimiza consultas de alertas por usuario 