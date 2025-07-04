# 🗄️ Sistema de Migrations y Seeders

Este documento explica cómo usar el sistema de control de versiones de base de datos implementado con Sequelize CLI.

## 📁 Estructura de Carpetas

```
backend/
├── migrations/          # Control de versiones de la base de datos
├── seeders/            # Datos iniciales y de ejemplo
├── .sequelizerc        # Configuración de Sequelize CLI
└── MIGRATIONS_README.md # Este archivo
```

## 🚀 Comandos Disponibles

### Migrations (Estructura de la Base de Datos)

```bash
# Ejecutar todas las migrations pendientes
npm run migrate

# Deshacer la última migration
npm run migrate:undo:last

# Deshacer todas las migrations
npm run migrate:undo
```

### Seeders (Datos Iniciales)

```bash
# Poblar la base de datos con datos de ejemplo
npm run seed

# Eliminar todos los datos de ejemplo
npm run seed:undo
```

### Comandos de Conveniencia

```bash
# Reset completo: eliminar BD, crear nueva, ejecutar migrations y seeders
npm run db:reset
```

## 📋 Migrations Disponibles

| Archivo | Función |
|---------|---------|
| `001-create-usuarios.js` | Tabla de usuarios del sistema |
| `002-create-tipo-equipo.js` | Tipos de equipos disponibles |
| `003-create-estado-equipo.js` | Estados operativos de equipos |
| `004-create-ubicaciones.js` | Ubicaciones físicas de equipos |
| `005-create-equipos.js` | Tabla principal de equipos con FK |
| `006-create-mantenimientos.js` | Registro de mantenimientos de equipos |
| `007-create-movimientos.js` | Registro de movimientos de equipos |
| `008-create-solicitudes.js` | Sistema de solicitudes de usuarios |
| `009-create-alertas.js` | Sistema de alertas y notificaciones |
| `010-create-reportes.js` | Sistema de reportes generados |
| `011-create-adjuntos-solicitudes.js` | Archivos adjuntos de solicitudes |

## 🌱 Seeders Disponibles

| Archivo | Función |
|---------|---------|
| `001-demo-data.js` | Datos de ejemplo completos |

### Datos Incluidos en el Seeder

#### 👥 Usuarios Administradores
- **admin** / Admin123 (Administrador)
- **tecnico** / Tecnico123 (Técnico)
- **usuario** / Usuario123 (Usuario)

#### 🖥️ Tipos de Equipo
- Computadora de Escritorio
- Laptop
- Proyector
- Impresora
- Tablet
- Servidor

#### 📊 Estados de Equipo
- Activo (Verde)
- En Mantenimiento (Amarillo)
- Fuera de Servicio (Rojo)
- En Reparación (Morado)
- Obsoleto (Gris)

#### 📍 Ubicaciones
- Edificio A: Aula 101, Aula 102
- Edificio B: Oficina Administrativa, Sala de Servidores
- Edificio C: Laboratorio 1, Auditorio

## 🔧 Instalación en Nuevo Entorno

1. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con credenciales de BD
   ```

2. **Crear base de datos**
   ```bash
   npx sequelize-cli db:create
   ```

3. **Ejecutar migrations**
   ```bash
   npm run migrate
   ```

4. **Poblar con datos de ejemplo (opcional)**
   ```bash
   npm run seed
   ```

## ⚠️ Notas Importantes

- **No se ejecutan seeders automáticamente** al arrancar el servidor
- **Los datos existentes no se sobrescriben** al ejecutar seeders
- **Usar `db:reset` con precaución** - elimina toda la base de datos
- **Las migrations se ejecutan en orden** según el prefijo numérico

## 🔄 Flujo de Trabajo Recomendado

1. **Desarrollo inicial**: `npm run db:reset`
2. **Cambios de estructura**: Crear nueva migration
3. **Datos de prueba**: Modificar seeders según necesidad
4. **Producción**: Solo migrations, sin seeders

## 📝 Crear Nueva Migration

```bash
npx sequelize-cli migration:generate --name nombre-de-la-migration
```

## 📝 Crear Nuevo Seeder

```bash
npx sequelize-cli seed:generate --name nombre-del-seeder
```

# 📋 Migraciones del Sistema de Inventarios

Este documento describe todas las migraciones disponibles para crear la estructura completa de la base de datos.

## 🗂️ Orden de Ejecución

Las migraciones deben ejecutarse en el siguiente orden para respetar las dependencias de claves foráneas:

### 1. **001-create-usuarios.js**
- **Tabla**: `usuarios`
- **Propósito**: Crear la tabla de usuarios del sistema
- **Campos principales**:
  - `nombre` (STRING) - Nombre completo del usuario
  - `usuario` (STRING) - Nombre de usuario único
  - `correo` (STRING) - Email único
  - `contraseña` (STRING) - Contraseña encriptada
  - `rol` (ENUM) - administrador, tecnico, usuario
  - `activo` (BOOLEAN) - Estado del usuario

### 2. **002-create-tipo-equipo.js**
- **Tabla**: `tipo_equipo`
- **Propósito**: Catálogo de tipos de equipos
- **Campos principales**:
  - `nombre` (STRING) - Nombre del tipo
  - `descripcion` (TEXT) - Descripción del tipo
  - `activo` (BOOLEAN) - Estado del tipo

### 3. **003-create-estado-equipo.js**
- **Tabla**: `estado_equipo`
- **Propósito**: Catálogo de estados operativos
- **Campos principales**:
  - `estado` (STRING) - Nombre del estado
  - `descripcion` (TEXT) - Descripción del estado
  - `color` (STRING) - Color para UI

### 4. **004-create-ubicaciones.js**
- **Tabla**: `ubicaciones`
- **Propósito**: Catálogo de ubicaciones físicas
- **Campos principales**:
  - `edificio` (STRING) - Nombre del edificio
  - `sala` (STRING) - Nombre de la sala
  - `descripcion` (TEXT) - Descripción de la ubicación
  - `activo` (BOOLEAN) - Estado de la ubicación

### 5. **005-create-equipos.js**
- **Tabla**: `equipos`
- **Propósito**: Inventario principal de equipos
- **Relaciones**:
  - `tipo_equipo_id` → `tipo_equipo.id`
  - `estado_id` → `estado_equipo.id`
  - `ubicacion_id` → `ubicaciones.id`
  - `usuario_asignado_id` → `usuarios.id`
- **Campos principales**:
  - `nombre` (STRING) - Nombre del equipo
  - `numero_serie` (STRING) - Número de serie único
  - `modelo` (STRING) - Modelo del equipo
  - `marca` (STRING) - Marca del equipo
  - `fecha_adquisicion` (DATE) - Fecha de compra
  - `costo_adquisicion` (DECIMAL) - Costo del equipo

### 6. **006-create-mantenimientos.js**
- **Tabla**: `mantenimientos`
- **Propósito**: Registro de mantenimientos realizados
- **Relaciones**:
  - `equipo_id` → `equipos.id`
  - `tecnico_id` → `usuarios.id`
  - `solicitante_id` → `usuarios.id`
- **Campos principales**:
  - `tipo_mantenimiento` (ENUM) - preventivo, correctivo, emergencia
  - `descripcion` (TEXT) - Descripción del mantenimiento
  - `fecha_inicio` (DATE) - Fecha de inicio
  - `fecha_fin` (DATE) - Fecha de finalización
  - `costo` (DECIMAL) - Costo del mantenimiento
  - `estado` (ENUM) - programado, en_proceso, completado, cancelado

### 7. **007-create-movimientos.js**
- **Tabla**: `movimientos`
- **Propósito**: Registro de movimientos de equipos
- **Relaciones**:
  - `equipo_id` → `equipos.id`
  - `ubicacion_origen_id` → `ubicaciones.id`
  - `ubicacion_destino_id` → `ubicaciones.id`
  - `usuario_origen_id` → `usuarios.id`
  - `usuario_destino_id` → `usuarios.id`
  - `autorizado_por_id` → `usuarios.id`
- **Campos principales**:
  - `tipo_movimiento` (ENUM) - asignacion, traslado, devolucion, prestamo
  - `fecha_movimiento` (DATE) - Fecha del movimiento
  - `motivo` (TEXT) - Motivo del movimiento
  - `observaciones` (TEXT) - Observaciones adicionales

### 8. **008-create-solicitudes.js**
- **Tabla**: `solicitudes`
- **Propósito**: Sistema de solicitudes de usuarios
- **Relaciones**:
  - `solicitante_id` → `usuarios.id`
  - `asignado_a_id` → `usuarios.id`
  - `equipo_id` → `equipos.id`
  - `ubicacion_id` → `ubicaciones.id`
- **Campos principales**:
  - `tipo_solicitud` (ENUM) - equipo, mantenimiento, movimiento, reporte
  - `titulo` (STRING) - Título de la solicitud
  - `descripcion` (TEXT) - Descripción detallada
  - `prioridad` (ENUM) - baja, media, alta, urgente
  - `estado` (ENUM) - pendiente, en_revision, aprobada, rechazada, completada, cancelada

### 9. **009-create-alertas.js**
- **Tabla**: `alertas`
- **Propósito**: Sistema de alertas y notificaciones
- **Relaciones**:
  - `equipo_id` → `equipos.id`
  - `mantenimiento_id` → `mantenimientos.id`
  - `solicitud_id` → `solicitudes.id`
  - `usuario_destino_id` → `usuarios.id`
  - `generado_por_id` → `usuarios.id`
- **Campos principales**:
  - `tipo_alerta` (ENUM) - mantenimiento, equipo_fuera_servicio, movimiento, solicitud_urgente, inventario
  - `titulo` (STRING) - Título de la alerta
  - `mensaje` (TEXT) - Mensaje detallado
  - `prioridad` (ENUM) - baja, media, alta, critica
  - `estado` (ENUM) - activa, leida, resuelta, descartada

### 10. **010-create-reportes.js**
- **Tabla**: `reportes`
- **Propósito**: Sistema de generación y gestión de reportes
- **Relaciones**:
  - `usuario_id` → `usuarios.id`
  - `equipo_id` → `equipos.id`
  - `ubicacion_id` → `ubicaciones.id`
- **Campos principales**:
  - `tipo_reporte` (ENUM) - inventario, mantenimiento, movimientos, solicitudes, alertas, personalizado
  - `titulo` (STRING) - Título del reporte
  - `formato` (ENUM) - pdf, excel, csv, html
  - `parametros` (JSON) - Parámetros del reporte
  - `ruta_archivo` (STRING) - Ruta del archivo generado
  - `estado` (ENUM) - generando, completado, error, expirado

## 🚀 Comandos de Migración

### Ejecutar todas las migraciones
```bash
npm run migrate
```

### Ejecutar migración específica
```bash
npx sequelize-cli db:migrate --to 005-create-equipos.js
```

### Deshacer última migración
```bash
npm run migrate:undo
```

### Deshacer todas las migraciones
```bash
npx sequelize-cli db:migrate:undo:all
```

### Ver estado de las migraciones
```bash
npx sequelize-cli db:migrate:status
```

## 📊 Índices Creados

Cada migración incluye índices optimizados para mejorar el rendimiento:

- **Índices de claves foráneas**: Para todas las relaciones
- **Índices de búsqueda**: Para campos frecuentemente consultados
- **Índices de fecha**: Para consultas por rangos de tiempo
- **Índices de estado**: Para filtros por estado

## 🔧 Configuración

Las migraciones utilizan la configuración definida en:
- `config/database.js` - Configuración de conexión
- `.sequelizerc` - Rutas de archivos

## ⚠️ Consideraciones

1. **Orden de ejecución**: Respetar el orden numérico para evitar errores de claves foráneas
2. **Backup**: Hacer backup antes de ejecutar migraciones en producción
3. **Testing**: Probar migraciones en entorno de desarrollo antes de producción
4. **Rollback**: Las migraciones incluyen función `down()` para deshacer cambios

## 📝 Notas de Desarrollo

- Todas las tablas incluyen `createdAt` y `updatedAt` automáticos
- Los campos de fecha usan `Sequelize.NOW` como valor por defecto
- Las relaciones incluyen `onUpdate` y `onDelete` apropiados
- Los comentarios están incluidos para documentación 