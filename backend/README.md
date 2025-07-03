# 🚀 Backend - Sistema de Gestión de Inventarios Tecnológicos

## 📋 Descripción

Backend del sistema de gestión de inventarios tecnológicos para el Instituto San Antonio, desarrollado con Node.js, Express y MySQL.

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **MySQL** - Base de datos
- **Sequelize** - ORM
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **Helmet** - Seguridad de headers
- **Morgan** - Logging
- **CORS** - Cross-origin resource sharing

## 🚀 Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales
   ```

4. **Configurar la base de datos:**
   - Crear base de datos MySQL
   - Ejecutar el script SQL en `docs/database_schema.sql`

5. **Ejecutar seed (datos iniciales):**
   ```bash
   npm run seed
   ```

6. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   ├── database.js          # Configuración de base de datos
│   ├── auth.js              # Configuración de autenticación JWT
│   └── index.js             # Configuraciones generales
├── controllers/
│   ├── authController.js    # Controlador de autenticación
│   ├── equipos.controller.js # Controlador de equipos
│   ├── tipo_equipo.controller.js # Controlador de tipos de equipo
│   ├── estado_equipo.controller.js # Controlador de estados de equipo
│   └── ubicaciones.controller.js # Controlador de ubicaciones
├── middleware/
│   ├── auth.js              # Middleware de autenticación
│   └── error.js             # Middleware de manejo de errores
├── models/
│   ├── index.js             # Configuración de modelos
│   ├── Usuario.js           # Modelo de usuario
│   ├── Equipo.js            # Modelo de equipo
│   ├── TipoEquipo.js        # Modelo de tipo de equipo
│   ├── EstadoEquipo.js      # Modelo de estado de equipo
│   ├── Ubicacion.js         # Modelo de ubicación
│   ├── Mantenimiento.js     # Modelo de mantenimiento
│   ├── Movimiento.js        # Modelo de movimiento
│   ├── Solicitud.js         # Modelo de solicitud
│   ├── Alerta.js            # Modelo de alerta
│   └── Reporte.js           # Modelo de reporte
├── routes/
│   ├── authRoutes.js        # Rutas de autenticación
│   ├── equipos.routes.js    # Rutas de equipos
│   ├── tipo_equipo.routes.js # Rutas de tipos de equipo
│   ├── estado_equipo.routes.js # Rutas de estados de equipo
│   └── ubicaciones.routes.js # Rutas de ubicaciones
├── utils/
│   ├── seedData.js          # Datos iniciales
│   └── logger.js            # Sistema de logging
├── scripts/
│   └── seed.js              # Script de seed manual
├── docs/
│   └── API.md               # Documentación de la API
├── server.js                # Servidor principal
├── package.json
└── REORGANIZACION.md        # Documentación de la reorganización
```

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación.

### Endpoints de Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Uso del Token

Incluir el token en el header de las peticiones:
```
Authorization: Bearer <token>
```

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Equipos
- `GET /api/equipos` - Obtener equipos (con filtros y paginación)
- `GET /api/equipos/:id` - Obtener equipo por ID
- `POST /api/equipos` - Crear equipo
- `PUT /api/equipos/:id` - Actualizar equipo
- `DELETE /api/equipos/:id` - Eliminar equipo
- `GET /api/equipos/estadisticas` - Obtener estadísticas

### Tipos de Equipo
- `GET /api/tipo-equipo` - Obtener tipos de equipo
- `GET /api/tipo-equipo/:id` - Obtener tipo por ID
- `POST /api/tipo-equipo` - Crear tipo de equipo
- `PUT /api/tipo-equipo/:id` - Actualizar tipo de equipo
- `DELETE /api/tipo-equipo/:id` - Eliminar tipo de equipo

### Estados de Equipo
- `GET /api/estado-equipo` - Obtener estados de equipo
- `GET /api/estado-equipo/:id` - Obtener estado por ID
- `POST /api/estado-equipo` - Crear estado de equipo
- `PUT /api/estado-equipo/:id` - Actualizar estado de equipo
- `DELETE /api/estado-equipo/:id` - Eliminar estado de equipo

### Ubicaciones
- `GET /api/ubicaciones` - Obtener ubicaciones
- `GET /api/ubicaciones/:id` - Obtener ubicación por ID
- `POST /api/ubicaciones` - Crear ubicación
- `PUT /api/ubicaciones/:id` - Actualizar ubicación
- `DELETE /api/ubicaciones/:id` - Eliminar ubicación

### Mantenimientos
- `GET /api/mantenimientos` - Obtener mantenimientos (con filtros y paginación)
- `GET /api/mantenimientos/:id` - Obtener mantenimiento por ID
- `POST /api/mantenimientos` - Crear mantenimiento
- `PUT /api/mantenimientos/:id` - Actualizar mantenimiento
- `DELETE /api/mantenimientos/:id` - Eliminar mantenimiento
- `GET /api/mantenimientos/stats/estadisticas` - Obtener estadísticas de mantenimientos
- `GET /api/mantenimientos/equipo/:equipo_id` - Obtener mantenimientos por equipo

### Movimientos
- `GET /api/movimientos` - Obtener movimientos (con filtros y paginación)
- `GET /api/movimientos/:id` - Obtener movimiento por ID
- `POST /api/movimientos` - Crear movimiento
- `PUT /api/movimientos/:id` - Actualizar movimiento
- `DELETE /api/movimientos/:id` - Eliminar movimiento
- `GET /api/movimientos/equipo/:equipo_id` - Obtener movimientos por equipo

### Solicitudes
- `GET /api/solicitudes` - Obtener solicitudes (con filtros y paginación)
- `GET /api/solicitudes/:id` - Obtener solicitud por ID
- `POST /api/solicitudes` - Crear solicitud
- `PUT /api/solicitudes/:id` - Actualizar solicitud
- `DELETE /api/solicitudes/:id` - Eliminar solicitud
- `GET /api/solicitudes/usuario/:usuario_id` - Obtener solicitudes por usuario

### Alertas
- `GET /api/alertas` - Obtener alertas (con filtros y paginación)
- `GET /api/alertas/:id` - Obtener alerta por ID
- `POST /api/alertas` - Crear alerta
- `PUT /api/alertas/:id` - Actualizar alerta
- `DELETE /api/alertas/:id` - Eliminar alerta
- `GET /api/alertas/equipo/:equipo_id` - Obtener alertas por equipo

### Reportes
- `GET /api/reportes` - Obtener reportes (con filtros y paginación)
- `GET /api/reportes/:id` - Obtener reporte por ID
- `POST /api/reportes` - Crear reporte
- `PUT /api/reportes/:id` - Actualizar reporte
- `DELETE /api/reportes/:id` - Eliminar reporte
- `GET /api/reportes/usuario/:usuario_id` - Obtener reportes por usuario

### Usuarios
- `GET /api/usuarios` - Obtener usuarios (con filtros y paginación)
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario
- `GET /api/usuarios/profile/me` - Obtener perfil del usuario actual
- `PUT /api/usuarios/profile/me` - Actualizar perfil del usuario actual

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas generales del sistema
- `GET /api/dashboard/stats/periodo` - Estadísticas por período
- `GET /api/dashboard/alertas/recientes` - Alertas recientes
- `GET /api/dashboard/mantenimientos/proximos` - Mantenimientos próximos

## 🔐 Roles y Permisos

### Administrador
- Acceso completo a todas las funcionalidades
- Puede crear, editar y eliminar equipos, tipos, estados y ubicaciones
- Puede gestionar usuarios
- Puede generar reportes

### Técnico
- Puede ver todos los equipos
- Puede crear y editar equipos
- Puede ver estadísticas
- Puede gestionar mantenimientos
- No puede eliminar equipos ni gestionar catálogos

### Usuario
- Puede ver equipos asignados
- Puede crear solicitudes
- Puede ver alertas
- Acceso limitado a funcionalidades

## 🚀 Scripts Disponibles

```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar servidor en desarrollo con nodemon
npm run seed       # Poblar base de datos con datos iniciales
npm run migrate    # Ejecutar migraciones de base de datos
npm run test       # Ejecutar tests (pendiente)
npm run lint       # Verificar código con ESLint (pendiente)
```

## 📝 Variables de Entorno

Crear archivo `.env` con las siguientes variables:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tesa_inventario
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Servidor
PORT=3000
NODE_ENV=development
HOST=localhost

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# Bcrypt
BCRYPT_SALT_ROUNDS=12
```

## 🎯 Características Implementadas

### ✅ Completado
- ✅ Autenticación JWT con roles
- ✅ Modelos de base de datos completos
- ✅ CRUD de equipos con filtros y paginación
- ✅ CRUD de tipos de equipo (separado)
- ✅ CRUD de estados de equipo (separado)
- ✅ CRUD de ubicaciones (separado)
- ✅ CRUD de mantenimientos (separado)
- ✅ CRUD de movimientos (separado)
- ✅ CRUD de solicitudes (separado)
- ✅ CRUD de alertas (separado)
- ✅ CRUD de reportes (separado)
- ✅ CRUD de usuarios (separado)
- ✅ Middleware de autenticación y autorización
- ✅ Middleware de manejo de errores centralizado
- ✅ Validaciones y manejo de errores
- ✅ Datos iniciales (seed)
- ✅ Documentación de API
- ✅ Seguridad (helmet, rate limiting, CORS)
- ✅ Sistema de logging
- ✅ Configuración modular
- ✅ Gestión de perfiles de usuario
- ✅ Encriptación de contraseñas con bcrypt

### 🔄 Pendiente
- 🔄 Validaciones con express-validator
- 🔄 Generación de reportes PDF/Excel
- 🔄 Notificaciones por email
- 🔄 Logs de auditoría
- 🔄 Testing unitario e integración
- 🔄 Dashboard con estadísticas
- 🔄 Sistema de notificaciones en tiempo real

## 📚 Documentación

- `docs/API.md` - Documentación completa de la API
- `REORGANIZACION.md` - Documentación de la reorganización realizada

## 🧪 Datos de Prueba

Al ejecutar `npm run seed`, se crean los siguientes datos:

### Usuarios
- **Administrador**: `admin` / `Admin123`
- **Técnico**: `tecnico` / `Tecnico123`
- **Usuario**: `usuario` / `Usuario123`

### Tipos de Equipo
- Computadora de Escritorio
- Laptop
- Proyector
- Impresora
- Tablet
- Servidor

### Estados de Equipo
- Activo (verde)
- En Mantenimiento (amarillo)
- Fuera de Servicio (rojo)
- En Reparación (púrpura)
- Obsoleto (gris)

### Ubicaciones
- Edificio A - Aula 101
- Edificio A - Aula 102
- Edificio B - Oficina Administrativa
- Edificio B - Sala de Servidores
- Edificio C - Laboratorio 1
- Edificio C - Auditorio

### Equipos de Ejemplo
- PC Administrativa 1
- Laptop Docente 1
- Proyector Aula 101
- Impresora Administrativa

## 🔄 Reorganización Reciente

El proyecto ha sido reorganizado siguiendo las mejores prácticas:

### ✅ **Mejoras Implementadas:**
- **Controladores separados por entidad** - Cada entidad tiene su propio controlador
- **Rutas organizadas por módulo** - Estructura más clara y mantenible
- **Middleware de errores centralizado** - Manejo consistente de errores
- **Configuración modular** - Separación de configuraciones por dominio
- **Sistema de logging** - Logging estructurado con niveles

### 📁 **Nueva Estructura:**
```
controllers/
├── equipos.controller.js      # Gestión de equipos
├── tipo_equipo.controller.js  # Tipos de equipo
├── estado_equipo.controller.js # Estados de equipo
├── ubicaciones.controller.js  # Ubicaciones
├── mantenimientos.controller.js # Mantenimientos
├── movimientos.controller.js  # Movimientos
├── solicitudes.controller.js  # Solicitudes
├── alertas.controller.js      # Alertas
├── reportes.controller.js     # Reportes
└── usuarios.controller.js     # Usuarios

routes/
├── equipos.routes.js          # Rutas de equipos
├── tipo_equipo.routes.js      # Rutas de tipos
├── estado_equipo.routes.js    # Rutas de estados
├── ubicaciones.routes.js      # Rutas de ubicaciones
├── mantenimientos.routes.js   # Rutas de mantenimientos
├── movimientos.routes.js      # Rutas de movimientos
├── solicitudes.routes.js      # Rutas de solicitudes
├── alertas.routes.js          # Rutas de alertas
├── reportes.routes.js         # Rutas de reportes
└── usuarios.routes.js         # Rutas de usuarios
```

Ver `REORGANIZACION.md` para detalles completos de la reorganización.

## 🎯 Estado Actual del Proyecto

### ✅ **Fase 1 Completada - Reorganización**
- ✅ Estructura modular implementada
- ✅ Controladores separados por entidad
- ✅ Rutas organizadas por módulo
- ✅ Middleware de errores centralizado
- ✅ Sistema de logging implementado
- ✅ Configuración modular

### ✅ **Fase 2 Completada - Controladores Restantes**
- ✅ Controlador de mantenimientos
- ✅ Controlador de movimientos
- ✅ Controlador de solicitudes
- ✅ Controlador de alertas
- ✅ Controlador de reportes
- ✅ Controlador de usuarios

### ✅ **Fase 3 Completada - Mejoras**
- ✅ Validaciones con express-validator
- ✅ Testing unitario e integración
- ✅ Generación de reportes PDF/Excel
- ✅ Logs de auditoría mejorados
- ✅ Dashboard con estadísticas
- 🔄 Notificaciones por email
- 🔄 Sistema de notificaciones en tiempo real

## 🚀 Próximos Pasos

1. **Probar todos los endpoints implementados**
2. **Agregar validaciones robustas con express-validator**
3. **Implementar testing unitario e integración**
4. **Desarrollar frontend con React**
5. **Implementar funcionalidades avanzadas (PDF, email, etc.)**

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## Contacto

Instituto San Antonio - [email@instituto.edu] 