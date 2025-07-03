# 🏫 Sistema de Gestión de Inventarios Tecnológicos para el Instituto San Antonio - Backend

Backend del Sistema de Gestión de Inventarios Tecnológicos para el Instituto San Antonio, desarrollado con Node.js, Express, MySQL y Sequelize.

## 🚀 Características

- **Autenticación JWT** con roles de usuario (Administrador, Técnico, Usuario)
- **API RESTful** completa con validaciones y manejo de errores
- **Base de datos MySQL** con Sequelize ORM
- **Sistema de migrations** para control de versiones de BD
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
│   ├── reportes.controller.js
│   ├── solicitudes.controller.js
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
│   └── 010-create-reportes.js
├── models/               # Modelos de Sequelize
│   ├── Usuario.js
│   ├── Equipo.js
│   ├── TipoEquipo.js
│   ├── EstadoEquipo.js
│   ├── Ubicacion.js
│   ├── Mantenimiento.js
│   ├── Movimiento.js
│   ├── Solicitud.js
│   ├── Alerta.js
│   └── Reporte.js
├── routes/               # Rutas de la API
│   ├── authRoutes.js
│   ├── equipos.routes.js
│   ├── mantenimientos.routes.js
│   ├── movimientos.routes.js
│   ├── reportes.routes.js
│   ├── solicitudes.routes.js
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

### Reportes
- `GET /api/reportes` - Listar reportes
- `POST /api/reportes` - Crear reporte
- `GET /api/reportes/:id` - Obtener reporte específico

### Usuarios
- `GET /api/usuarios` - Listar usuarios (solo admin)
- `POST /api/usuarios` - Crear usuario (solo admin)
- `PUT /api/usuarios/:id` - Actualizar usuario (solo admin)

## 🔒 Seguridad

- **JWT Tokens** para autenticación
- **bcryptjs** para encriptación de contraseñas
- **Helmet** para headers de seguridad
- **CORS** configurado
- **Rate Limiting** para prevenir ataques
- **Validación de entrada** con express-validator

## 📊 Base de Datos

### Tablas Principales
- **usuarios** - Usuarios del sistema
- **equipos** - Inventario de equipos
- **tipo_equipo** - Tipos de equipos
- **estado_equipo** - Estados operativos
- **ubicaciones** - Ubicaciones físicas
- **mantenimientos** - Registro de mantenimientos
- **movimientos** - Movimientos de equipos
- **solicitudes** - Solicitudes de usuarios
- **alertas** - Alertas del sistema
- **reportes** - Reportes generados

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:coverage
```

## 📝 Logs y Auditoría

- **Logs de aplicación** con Morgan
- **Logs de auditoría** para acciones críticas
- **Logs de errores** con stack traces
- **Logs de base de datos** en desarrollo

## 📈 Reportes

- **Reportes PDF** con PDFKit
- **Reportes Excel** con ExcelJS
- **Reportes de inventario**
- **Reportes de mantenimiento**
- **Reportes de movimientos**

## 🌐 Variables de Entorno

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tesa_inventario
DB_USER=root
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Servidor
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia TESA.

## 👥 Autores

- **Instituto San Antonio** - Desarrollo inicial

## 🙏 Agradecimientos

- Equipo de desarrollo del Instituto San Antonio
- Comunidad de Node.js y Express
- Contribuidores de las librerías utilizadas 