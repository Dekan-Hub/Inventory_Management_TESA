# 🏫 Sistema de Gestión de Inventarios Tecnológicos para el Instituto San Antonio - Frontend

Frontend del Sistema de Gestión de Inventarios Tecnológicos para el Instituto San Antonio, desarrollado con React, Vite y Tailwind CSS.

## 🚀 Características

- **Interfaz moderna** con React 18 y Vite
- **Diseño responsivo** con Tailwind CSS
- **Autenticación JWT** integrada con el backend
- **Sistema de rutas** con React Router
- **Gestión de estado** con Context API
- **Componentes reutilizables** y modulares
- **Sistema de adjuntos** para archivos
- **Filtros avanzados** en todas las páginas
- **Manejo de errores** con Error Boundary
- **Testing** preparado con Jest (futuro)

## 📁 Estructura del Proyecto

```
frontend/
├── public/                 # Archivos públicos
│   └── index.html
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Table.jsx      # Tabla dinámica
│   │   ├── Card.jsx       # Card informativo
│   │   ├── Button.jsx     # Botón con estados
│   │   ├── Modal.jsx      # Modal reutilizable
│   │   ├── Loader.jsx     # Spinner de carga
│   │   ├── AdjuntosList.jsx # Lista de adjuntos
│   │   ├── FilterBar.jsx  # Barra de filtros
│   │   ├── Navbar.jsx     # Navegación principal
│   │   ├── Sidebar.jsx    # Menú lateral
│   │   ├── ProtectedRoute.jsx # Protección de rutas
│   │   └── EquipoForm.jsx # Formulario de equipos
│   ├── context/           # Contextos de React
│   │   └── AuthContext.jsx # Contexto de autenticación
│   ├── layout/            # Layouts de la aplicación
│   │   └── Layout.jsx     # Layout principal
│   ├── pages/             # Páginas de la aplicación
│   │   ├── DashboardPage.jsx
│   │   ├── EquiposPage.jsx
│   │   ├── MantenimientosPage.jsx
│   │   ├── MovimientosPage.jsx
│   │   ├── SolicitudesPage.jsx
│   │   ├── ReportesPage.jsx
│   │   ├── UsuariosPage.jsx
│   │   ├── ConfiguracionPage.jsx
│   │   └── LoginPage.jsx
│   ├── services/          # Servicios de API
│   │   ├── api.js        # Configuración base
│   │   ├── equiposService.js
│   │   ├── mantenimientosService.js
│   │   ├── movimientosService.js
│   │   ├── solicitudesService.js
│   │   ├── adjuntosService.js
│   │   ├── usuariosService.js
│   │   ├── reportesService.js
│   │   └── dashboardService.js
│   ├── assets/            # Recursos estáticos
│   │   └── images/
│   ├── App.jsx           # Componente principal
│   ├── main.jsx          # Punto de entrada
│   ├── index.css         # Estilos globales
│   └── App.css           # Estilos de la aplicación
├── .env                  # Variables de entorno
├── package.json
├── vite.config.js        # Configuración de Vite
├── tailwind.config.js    # Configuración de Tailwind
├── postcss.config.js     # Configuración de PostCSS
├── eslint.config.js      # Configuración de ESLint
└── index.html            # HTML principal
```

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **JWT** - Autenticación
- **Context API** - Estado global
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS

## 🔧 Instalación

### Prerrequisitos
- Node.js >= 16.0.0
- npm o yarn
- Backend funcionando en puerto 3000

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con la URL del backend
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en navegador**
   ```
   http://localhost:5173
   ```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run preview          # Preview del build

# Linting
npm run lint             # Verificar código
npm run lint:fix         # Corregir código automáticamente

# Testing (futuro)
npm test                 # Ejecutar tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con cobertura
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

## 📡 Páginas y Funcionalidades

### 🎯 Dashboard
- `GET /dashboard` - Panel principal con estadísticas
- **Estadísticas en tiempo real** del sistema
- **Cards informativas** con datos de:
  - Total de equipos
  - Equipos en mantenimiento
  - Equipos en correctivo
  - Total de categorías
  - Solicitudes pendientes
  - Movimientos recientes
- **Diseño responsivo** con grid adaptativo
- **Manejo de errores** con mensajes informativos

### 🖥️ Gestión de Equipos
- `GET /equipos` - Lista de equipos
- `POST /equipos` - Crear equipo
- `PUT /equipos/:id` - Editar equipo
- `DELETE /equipos/:id` - Eliminar equipo
- **Lista detallada** con relaciones completas
- **Campos mostrados:**
  - Nombre del equipo
  - Número de serie
  - Modelo y marca
  - Tipo de equipo (con relación)
  - Estado del equipo (con relación)
  - Ubicación (edificio - sala)
  - Usuario asignado
  - Fecha de adquisición
- **Funcionalidades:**
  - Crear nuevo equipo
  - Editar equipo existente
  - Eliminar equipo
  - Asignar ubicación y usuario
  - Filtros avanzados por tipo, estado, ubicación
- **Relaciones integradas** con tipos, estados y ubicaciones
- **Formulario mejorado** con validaciones

### 🔧 Gestión de Mantenimientos
- `GET /mantenimientos` - Lista de mantenimientos
- `POST /mantenimientos` - Crear mantenimiento
- `PUT /mantenimientos/:id` - Editar mantenimiento
- `DELETE /mantenimientos/:id` - Eliminar mantenimiento
- **Lista completa** con información técnica
- **Campos mostrados:**
  - Equipo asociado
  - Tipo de mantenimiento (preventivo/correctivo/calibración)
  - Fecha del mantenimiento
  - Técnico responsable
  - Costo del mantenimiento
  - Estado del mantenimiento
  - Observaciones
- **Estados visuales** con colores diferenciados:
  - Programado (azul)
  - En proceso (amarillo)
  - Completado (verde)
  - Cancelado (rojo)
- **Tipos diferenciados** con colores específicos
- **Filtros por equipo, técnico y estado**

### 📦 Gestión de Movimientos
- `GET /movimientos` - Lista de movimientos
- `POST /movimientos` - Crear movimiento
- `PUT /movimientos/:id` - Editar movimiento
- `DELETE /movimientos/:id` - Eliminar movimiento
- **Lista detallada** de movimientos de equipos
- **Campos mostrados:**
  - Equipo movido
  - Ubicación origen (edificio - sala)
  - Ubicación destino (edificio - sala)
  - Fecha del movimiento
  - Responsable del movimiento
  - Motivo (truncado si es muy largo)
  - Estado del movimiento
  - Observaciones
- **Estados visuales** con colores:
  - Pendiente (amarillo)
  - Aprobado (verde)
  - Rechazado (rojo)
  - Completado (azul)
- **Filtros por equipo, responsable y estado**

### 📋 Gestión de Solicitudes
- `GET /solicitudes` - Lista de solicitudes
- `GET /solicitudes/mis-solicitudes` - Mis solicitudes
- `POST /solicitudes` - Crear solicitud
- `PUT /solicitudes/:id` - Editar solicitud
- `POST /solicitudes/:id/responder` - Responder solicitud (admin)
- `DELETE /solicitudes/:id` - Eliminar solicitud (admin)
- **Lista completa** de solicitudes del sistema
- **Campos mostrados:**
  - Título de la solicitud
  - Tipo de solicitud (nuevo equipo/mantenimiento/movimiento/otro)
  - Solicitante
  - Equipo asociado (si aplica)
  - Fecha de solicitud
  - Estado de la solicitud
  - Respuesta del administrador
- **Tipos diferenciados** con colores específicos
- **Estados visuales** con colores diferenciados
- **Sistema de adjuntos** integrado
- **Respuesta de administradores** con formulario dedicado
- **Filtros por tipo, estado y solicitante**

### 📎 Sistema de Adjuntos
- `GET /adjuntos/solicitud/:solicitud_id` - Obtener adjuntos
- `POST /adjuntos/solicitud/:solicitud_id` - Subir adjunto
- `GET /adjuntos/:id/download` - Descargar adjunto
- `DELETE /adjuntos/:id` - Eliminar adjunto
- **Subida de archivos** en solicitudes
- **Tipos permitidos**: PDF, Word, Excel, imágenes, texto
- **Límite de tamaño**: 10MB por archivo
- **Lista de adjuntos** con información detallada
- **Descarga de archivos** con autenticación
- **Eliminación de adjuntos** con permisos
- **Componente reutilizable** para gestión de archivos

### 📊 Reportes
- `GET /reportes` - Lista de reportes
- `POST /reportes` - Generar reporte
- `GET /reportes/:id/download` - Descargar reporte
- **Generación de reportes** en Excel y PDF
- **Tipos de reporte**:
  - Inventario de equipos
  - Mantenimientos realizados
  - Movimientos de equipos
  - Solicitudes del sistema
- **Filtros personalizables** para reportes
- **Descarga directa** de archivos generados

### 👥 Gestión de Usuarios
- `GET /usuarios` - Lista de usuarios
- `POST /usuarios` - Crear usuario
- `PUT /usuarios/:id` - Editar usuario
- `DELETE /usuarios/:id` - Eliminar usuario
- **Lista completa** con información detallada
- **Campos mostrados:**
  - Nombre del usuario
  - Correo electrónico
  - Rol (con colores diferenciados)
  - Usuario (nombre de login)
  - Estado activo/inactivo
- **Funcionalidades:**
  - Crear nuevo usuario
  - Editar usuario existente
  - Eliminar usuario
  - Filtros y búsqueda
- **Estados visuales** para roles (administrador, técnico, usuario)

## 📊 Funcionalidades Principales

### Gestión de Equipos
- ✅ CRUD completo de equipos
- ✅ Asignación a usuarios
- ✅ Control de ubicaciones
- ✅ Estados operativos
- ✅ Búsqueda y filtros avanzados
- ✅ Formularios con validación

### Sistema de Solicitudes
- ✅ Creación de solicitudes por usuarios
- ✅ Respuesta y aprobación por administradores
- ✅ Adjuntos de archivos (PDF, Word, Excel, imágenes)
- ✅ Estados de solicitud (pendiente, aprobada, rechazada, etc.)
- ✅ Historial completo de solicitudes
- ✅ Filtros por tipo y estado

### Gestión de Mantenimientos
- ✅ Registro de mantenimientos preventivos y correctivos
- ✅ Asignación de técnicos
- ✅ Control de costos
- ✅ Estados de mantenimiento
- ✅ Filtros por equipo y técnico

### Movimientos de Equipos
- ✅ Registro de movimientos entre ubicaciones
- ✅ Control de responsables
- ✅ Estados de movimiento
- ✅ Historial de movimientos
- ✅ Filtros por equipo y responsable

### Sistema de Adjuntos
- ✅ Subida de archivos (máximo 10MB)
- ✅ Tipos permitidos: PDF, Word, Excel, imágenes, texto
- ✅ Descarga segura de archivos
- ✅ Eliminación con permisos
- ✅ Almacenamiento organizado
- ✅ Componente reutilizable

### Reportes
- ✅ Generación de reportes en Excel y PDF
- ✅ Reportes de inventario
- ✅ Reportes de mantenimientos
- ✅ Reportes de movimientos
- ✅ Reportes personalizados
- ✅ Descarga directa

## 🔒 Seguridad

- **Autenticación JWT** con tokens seguros
- **Autorización por roles** con permisos granulares
- **Validación de formularios** en el frontend
- **Protección de rutas** con ProtectedRoute
- **Manejo seguro de archivos** en adjuntos
- **CORS** configurado para el backend
- **Validación de tipos** de archivo
- **Límites de tamaño** en adjuntos

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
# API Backend
VITE_API_URL=http://localhost:3000/api

# Aplicación
VITE_APP_NAME=Sistema de Inventario TESA
VITE_APP_VERSION=1.0.0

# Desarrollo
VITE_DEV_SERVER_PORT=5173
```

### Comandos de Despliegue

```bash
# Instalar dependencias
npm install

# Build de producción
npm run build

# Servir archivos estáticos
npm run preview

# Desplegar en servidor
# Copiar carpeta dist/ al servidor web
```

## 📚 Documentación Adicional

- [Backend API](./../backend/docs/API.md) - Documentación de la API
- [Database Schema](./../backend/docs/base%20de%20datos/database_schema.sql) - Esquema de base de datos
- [ER Diagram](./../backend/docs/base%20de%20datos/ER_Diagram.md) - Diagrama entidad-relación

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
- **Proyecto**: [https://github.com/tesa/inventario-frontend](https://github.com/tesa/inventario-frontend)

## Funcionalidades principales

- Login y autenticación de usuarios
- Panel de navegación con acceso a equipos, mantenimientos, movimientos, solicitudes, reportes
- Gestión de equipos, mantenimientos, movimientos y solicitudes
- Adjuntos en solicitudes y reportes
- Página de reportes:
  - Listado y filtrado de reportes generados
  - Generación de nuevos reportes por tipo, rango de fechas y formato (PDF o Excel)
  - Visualización de detalles de cada reporte en modal
  - Descarga de archivos generados (PDF/Excel) si están disponibles
  - Widgets de estadísticas de reportes (total, completados, en proceso, pendientes)

## Estructura de archivos

- `src/pages/` Páginas principales del sistema
- `src/components/` Componentes reutilizables (Tabla, Modal, Botón, etc.)
- `src/services/` Servicios para consumir la API
- `src/context/` Contextos globales (auth, etc.)

## Requisitos

- Node.js 18+
- Vite

## Ejecución

```bash
npm install
npm run dev
``` 