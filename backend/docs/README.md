# 🏫 Sistema de Gestión de Inventarios Tecnológicos para el Instituto San Antonio - Backend

Backend del Sistema de Gestión de Inventarios Tecnológicos para el Instituto San Antonio, desarrollado con Node.js, Express, MySQL y Sequelize.

## 🚀 Características

- **Autenticación JWT** con roles de usuario (Administrador, Técnico, Usuario)
- **API RESTful** completa con validaciones y manejo de errores
- **Base de datos MySQL** con Sequelize ORM
- **Sistema de migrations** para control de versiones de BD
- **Sistema de adjuntos** para archivos en solicitudes
- **Logs de auditoría** y generación de reportes
- **Seguridad** con Helmet, CORS y Rate Limiting
- **Testing** con Jest
- **Documentación** completa de API

## 📁 Estructura del Proyecto

```
backend/
├── config/                 # Configuraciones
│   ├── auth.js            # Configuración de autenticación
│   ├── database.js        # Configuración de base de datos
│   └── index.js           # Configuración general
├── controllers/           # Controladores de la API
│   ├── authController.js  # Autenticación y autorización
│   ├── equipos.controller.js
│   ├── mantenimientos.controller.js
│   ├── movimientos.controller.js
│   ├── solicitudes.controller.js
│   ├── adjuntos.controller.js
│   ├── reportes.controller.js
│   ├── tipo_equipo.controller.js
│   ├── ubicaciones.controller.js
│   └── usuarios.controller.js
├── middleware/            # Middlewares personalizados
│   ├── auth.js           # Autenticación JWT
│   ├── error.js          # Manejo de errores
│   └── validation.js     # Validaciones
├── migrations/            # Control de versiones de BD
│   ├── 001-create-usuarios.js
│   ├── 002-create-tipo-equipo.js
│   ├── 003-create-estado-equipo.js
│   ├── 004-create-ubicaciones.js
│   ├── 005-create-equipos.js
│   ├── 006-create-mantenimientos.js
│   ├── 007-create-movimientos.js
│   ├── 008-create-solicitudes.js
│   ├── 009-create-alertas.js
│   ├── 010-create-reportes.js
│   └── 011-create-adjuntos-solicitudes.js
├── models/               # Modelos de Sequelize
│   ├── Usuario.js
│   ├── Equipo.js
│   ├── TipoEquipo.js
│   ├── EstadoEquipo.js
│   ├── Ubicacion.js
│   ├── Mantenimiento.js
│   ├── Movimiento.js
│   ├── Solicitud.js
│   ├── AdjuntoSolicitud.js
│   ├── Alerta.js
│   └── Reporte.js
├── routes/               # Rutas de la API
│   ├── authRoutes.js
│   ├── equipos.routes.js
│   ├── mantenimientos.routes.js
│   ├── movimientos.routes.js
│   ├── solicitudes.routes.js
│   ├── adjuntos.routes.js
│   ├── reportes.routes.js
│   ├── tipo_equipo.routes.js
│   ├── ubicaciones.routes.js
│   └── usuarios.routes.js
├── seeders/              # Datos iniciales
│   └── 001-demo-data.js
├── utils/                # Utilidades
│   ├── auditLogger.js    # Logs de auditoría
│   ├── logger.js         # Sistema de logging
│   ├── reportGenerator.js # Generación de reportes
│   └── seedData.js       # Datos de ejemplo
├── uploads/              # Archivos subidos
│   └── adjuntos/         # Adjuntos de solicitudes
├── tests/                # Tests unitarios
├── .env                  # Variables de entorno
├── .sequelizerc          # Configuración Sequelize CLI
├── package.json
└── server.js             # Servidor principal
```

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de datos
- **Sequelize** - ORM para Node.js
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **Helmet** - Seguridad
- **Morgan** - Logging
- **Multer** - Manejo de archivos
- **Jest** - Testing
- **ExcelJS** - Generación de reportes Excel
- **PDFKit** - Generación de reportes PDF

## 🔧 Instalación

### Prerrequisitos
- Node.js >= 16.0.0
- MySQL >= 8.0
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con las credenciales de tu base de datos
   ```

4. **Crear base de datos**
   ```bash
   npx sequelize-cli db:create
   ```

5. **Ejecutar migrations**
   ```bash
   npm run migrate
   ```

6. **Poblar con datos de ejemplo (opcional)**
   ```bash
   npm run seed
   ```

7. **Iniciar servidor**
   ```bash
   npm start
   ```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm start              # Iniciar servidor
npm run dev            # Modo desarrollo con nodemon

# Base de datos
npm run migrate        # Ejecutar migrations
npm run migrate:undo   # Deshacer migrations
npm run seed           # Poblar datos de ejemplo
npm run seed:undo      # Eliminar datos de ejemplo
npm run db:reset       # Reset completo de BD

# Testing
npm test               # Ejecutar tests
npm run test:watch     # Tests en modo watch
npm run test:coverage  # Tests con cobertura

# Linting
npm run lint           # Verificar código
npm run lint:fix       # Corregir código automáticamente
```

## 🔐 Autenticación y Roles

### Roles de Usuario
- **Administrador**: Acceso completo al sistema
- **Técnico**: Gestión de equipos y mantenimientos
- **Usuario**: Consulta y solicitudes básicas

### Credenciales de Prueba
- **admin** / Admin123 (Administrador)
- **tecnico** / Tecnico123 (Técnico)
- **usuario** / Usuario123 (Usuario)

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario (solo admin)
- `GET /api/auth/verify` - Verificar token
- `GET /api/auth/profile` - Obtener perfil

### Equipos
- `GET /api/equipos` - Listar equipos
- `POST /api/equipos` - Crear equipo
- `PUT /api/equipos/:id` - Actualizar equipo
- `DELETE /api/equipos/:id` - Eliminar equipo

### Mantenimientos
- `GET /api/mantenimientos` - Listar mantenimientos
- `POST /api/mantenimientos` - Crear mantenimiento
- `PUT /api/mantenimientos/:id` - Actualizar mantenimiento
- `DELETE /api/mantenimientos/:id` - Eliminar mantenimiento

### Movimientos
- `GET /api/movimientos` - Listar movimientos
- `POST /api/movimientos` - Crear movimiento
- `PUT /api/movimientos/:id` - Actualizar movimiento
- `DELETE /api/movimientos/:id` - Eliminar movimiento

### Solicitudes
- `GET /api/solicitudes` - Listar solicitudes
- `GET /api/solicitudes/mis-solicitudes` - Mis solicitudes
- `POST /api/solicitudes` - Crear solicitud
- `PUT /api/solicitudes/:id` - Actualizar solicitud
- `POST /api/solicitudes/:id/responder` - Responder solicitud (admin)
- `DELETE /api/solicitudes/:id` - Eliminar solicitud (admin)

### Adjuntos
- `GET /api/adjuntos/solicitud/:solicitud_id` - Obtener adjuntos
- `POST /api/adjuntos/solicitud/:solicitud_id` - Subir adjunto
- `GET /api/adjuntos/:id/download` - Descargar adjunto
- `DELETE /api/adjuntos/:id` - Eliminar adjunto

### Reportes
- `GET /api/reportes` - Listar reportes
- `POST /api/reportes` - Generar reporte
- `GET /api/reportes/:id/download` - Descargar reporte

## 📊 Funcionalidades Principales

### Gestión de Equipos
- ✅ CRUD completo de equipos
- ✅ Asignación a usuarios
- ✅ Control de ubicaciones
- ✅ Estados operativos
- ✅ Búsqueda y filtros avanzados

### Sistema de Solicitudes
- ✅ Creación de solicitudes por usuarios
- ✅ Respuesta y aprobación por administradores
- ✅ Adjuntos de archivos (PDF, Word, Excel, imágenes)
- ✅ Estados de solicitud (pendiente, aprobada, rechazada, etc.)
- ✅ Historial completo de solicitudes

### Gestión de Mantenimientos
- ✅ Registro de mantenimientos preventivos y correctivos
- ✅ Asignación de técnicos
- ✅ Control de costos
- ✅ Estados de mantenimiento

### Movimientos de Equipos
- ✅ Registro de movimientos entre ubicaciones
- ✅ Control de responsables
- ✅ Estados de movimiento
- ✅ Historial de movimientos

### Sistema de Adjuntos
- ✅ Subida de archivos (máximo 10MB)
- ✅ Tipos permitidos: PDF, Word, Excel, imágenes, texto
- ✅ Descarga segura de archivos
- ✅ Eliminación con permisos
- ✅ Almacenamiento organizado

### Reportes
- ✅ Generación de reportes en Excel y PDF
- ✅ Reportes de inventario
- ✅ Reportes de mantenimientos
- ✅ Reportes de movimientos
- ✅ Reportes personalizados

## 🔒 Seguridad

- **Autenticación JWT** con tokens seguros
- **Autorización por roles** con permisos granulares
- **Validación de datos** en todos los endpoints
- **Rate limiting** para prevenir abuso
- **Helmet** para headers de seguridad
- **CORS** configurado para el frontend
- **Encriptación** de contraseñas con bcrypt
- **Validación de archivos** en adjuntos

## 📝 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:coverage
```

## 🚀 Despliegue

### Variables de Entorno Requeridas

```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=inventory_management

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro

# Servidor
PORT=3000
NODE_ENV=production

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Comandos de Despliegue

```bash
# Instalar dependencias
npm install --production

# Ejecutar migrations
npm run migrate

# Iniciar servidor
npm start
```

## 📚 Documentación Adicional

- [API Documentation](./API.md) - Documentación completa de la API
- [Migrations Guide](./MIGRATIONS_README.md) - Guía de migraciones
- [Database Schema](./base%20de%20datos/database_schema.sql) - Esquema de base de datos
- [ER Diagram](./base%20de%20datos/ER_Diagram.md) - Diagrama entidad-relación

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Desarrollador**: Equipo de Desarrollo TESA
- **Email**: desarrollo@tesa.edu
- **Proyecto**: [https://github.com/tesa/inventario-backend](https://github.com/tesa/inventario-backend) 