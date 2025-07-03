# 🏭 Sistema de Inventario TESA

Sistema completo de gestión de inventario para TESA, desarrollado con tecnologías modernas y arquitectura robusta.

## 📋 Descripción

El Sistema de Inventario TESA es una aplicación web completa que permite gestionar equipos, mantenimientos, solicitudes, reportes y más. Diseñado con una arquitectura cliente-servidor moderna y segura.

## 🚀 Características Principales

### Backend (Node.js/Express)
- **Autenticación JWT** con roles de usuario
- **Base de datos MySQL** con Sequelize ORM
- **API RESTful** completa y documentada
- **Validaciones** robustas con Joi
- **Logs de auditoría** automáticos
- **Generación de reportes** en PDF y Excel
- **Testing** con Jest
- **Migrations y Seeders** para control de base de datos

### Frontend (React/Vite)
- **Interfaz moderna** con Tailwind CSS
- **Colores institucionales** de TESA
- **Componentes reutilizables**
- **Navegación intuitiva**
- **Formularios dinámicos**
- **Tablas interactivas**

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para MySQL
- **MySQL** - Base de datos
- **JWT** - Autenticación
- **Joi** - Validaciones
- **Jest** - Testing
- **Multer** - Manejo de archivos
- **PDFKit** - Generación de PDFs
- **ExcelJS** - Generación de Excel

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **Axios** - Cliente HTTP
- **React Router** - Navegación
- **React Icons** - Iconografía

## 📁 Estructura del Proyecto

```
Tesa-inventario/
├── backend/                 # Servidor Node.js/Express
│   ├── config/             # Configuraciones
│   ├── controllers/        # Controladores de la API
│   ├── middleware/         # Middlewares personalizados
│   ├── models/            # Modelos de Sequelize
│   ├── routes/            # Rutas de la API
│   ├── migrations/        # Migraciones de base de datos
│   ├── seeders/           # Datos iniciales
│   ├── tests/             # Tests unitarios
│   └── utils/             # Utilidades y helpers
├── frontend/              # Cliente React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── services/      # Servicios de API
│   │   └── layout/        # Componentes de layout
│   └── public/            # Archivos estáticos
└── docs/                  # Documentación
```

## 🎨 Paleta de Colores Institucional

- **Morado TESA**: `#6F4BA1`
- **Amarillo Oro**: `#D5A126`
- **Negro Suave**: `#1A1A1A`
- **Gris Claro**: `#F5F5F5`
- **Blanco**: `#FFFFFF`

## 🔐 Roles de Usuario

- **Administrador**: Acceso completo al sistema
- **Técnico**: Gestión de equipos y mantenimientos
- **Usuario**: Consulta y solicitudes básicas

## 📊 Módulos del Sistema

### 1. Dashboard
- Resumen general del inventario
- Estadísticas en tiempo real
- Gráficos y métricas

### 2. Equipos
- Gestión completa de equipos
- Categorización por tipo
- Estados y ubicaciones
- Historial de movimientos

### 3. Mantenimientos
- Programación de mantenimientos
- Historial de servicios
- Alertas automáticas
- Costos y tiempos

### 4. Solicitudes
- Sistema de tickets
- Flujo de aprobación
- Seguimiento de estado
- Notificaciones

### 5. Reportes
- Reportes personalizados
- Exportación PDF/Excel
- Filtros avanzados
- Análisis de datos

### 6. Configuración
- Gestión de usuarios
- Configuración del sistema
- Catálogos y parámetros

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- MySQL 8.0+
- Git

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Tesa-inventario
```

### 2. Configurar Backend
```bash
cd backend
npm install
```

Crear archivo `.env` basado en `.env.example`:
```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASS=tu_password
DB_NAME=tesa_inventario
JWT_SECRET=tu_jwt_secret
PORT=3001
```

### 3. Configurar Base de Datos
```bash
# Ejecutar migraciones
npm run migrate

# Cargar datos iniciales
npm run seed
```

### 4. Configurar Frontend
```bash
cd ../frontend
npm install
```

### 5. Ejecutar el Proyecto

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 📝 Comandos Útiles

### Backend
```bash
npm run dev          # Desarrollo con nodemon
npm start            # Producción
npm test             # Ejecutar tests
npm run migrate      # Ejecutar migraciones
npm run seed         # Cargar datos iniciales
npm run migrate:undo # Revertir migraciones
```

### Frontend
```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno
El proyecto utiliza variables de entorno para configuración. Copia `.env.example` a `.env` y ajusta los valores:

```env
# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=tesa_inventario

# JWT
JWT_SECRET=tu_secret_super_seguro

# Servidor
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Base de Datos
El sistema utiliza MySQL con las siguientes tablas principales:
- `usuarios` - Gestión de usuarios y roles
- `equipos` - Inventario de equipos
- `mantenimientos` - Programación de servicios
- `solicitudes` - Sistema de tickets
- `reportes` - Generación de reportes
- `alertas` - Notificaciones del sistema

## 🧪 Testing

### Backend
```bash
npm test             # Ejecutar todos los tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con cobertura
```

### Frontend
```bash
npm test             # Ejecutar tests
npm run test:ui      # Tests con interfaz visual
```

## 📚 Documentación API

La documentación completa de la API está disponible en:
- **Swagger UI**: `http://localhost:3001/api-docs`
- **Postman Collection**: `docs/API.md`

### Endpoints Principales

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

#### Equipos
- `GET /api/equipos` - Listar equipos
- `POST /api/equipos` - Crear equipo
- `PUT /api/equipos/:id` - Actualizar equipo
- `DELETE /api/equipos/:id` - Eliminar equipo

#### Mantenimientos
- `GET /api/mantenimientos` - Listar mantenimientos
- `POST /api/mantenimientos` - Crear mantenimiento
- `PUT /api/mantenimientos/:id` - Actualizar mantenimiento

#### Reportes
- `GET /api/reportes/equipos` - Reporte de equipos
- `GET /api/reportes/mantenimientos` - Reporte de mantenimientos
- `POST /api/reportes/generar` - Generar reporte personalizado

## 🔒 Seguridad

- **Autenticación JWT** con expiración
- **Autorización por roles** granular
- **Validación de datos** en frontend y backend
- **Sanitización** de inputs
- **CORS** configurado
- **Rate limiting** implementado
- **Logs de auditoría** automáticos

## 📈 Monitoreo y Logs

El sistema incluye:
- **Logs de aplicación** con Winston
- **Logs de auditoría** automáticos
- **Métricas de rendimiento**
- **Alertas del sistema**

## 🚀 Despliegue

### Producción
```bash
# Backend
npm run build
npm start

# Frontend
npm run build
# Servir archivos estáticos
```

### Docker (Próximamente)
```bash
docker-compose up -d
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propiedad de TESA y está destinado para uso interno.

## 👥 Equipo de Desarrollo

- **Desarrollador Principal**: [Tu Nombre]
- **Fecha de Creación**: 2024
- **Versión**: 1.0.0

## 📞 Soporte

Para soporte técnico o consultas:
- **Email**: soporte@tesa.com
- **Teléfono**: [Número de contacto]
- **Documentación**: [Enlace a documentación]

---

**TESA - Tecnología y Servicios Avanzados** 🏭