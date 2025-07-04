# 📚 Documentación de la API

## 🌐 Información General

- **Base URL**: `http://localhost:3000/api`
- **Versión**: 1.0.0
- **Formato de respuesta**: JSON
- **Autenticación**: JWT Bearer Token

## 🔐 Autenticación

### Login
```http
POST /api/auth/login
```

**Body:**
```json
{
  "usuario": "Admin",
  "contraseña": "Admin123"
}
```

**Respuesta:**
```json
{
  "message": "Login exitoso.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 1,
      "nombre": "Administrador del Sistema",
      "usuario": "Admin",
      "correo": "admin@instituto.edu",
      "rol": "administrador"
    }
  }
}
```

### Registro
```http
POST /api/auth/register
```

**Body:**
```json
{
  "nombre": "Nuevo Usuario",
  "usuario": "nuevo_usuario",
  "correo": "nuevo@instituto.edu",
  "contraseña": "Contraseña123",
  "rol": "usuario"
}
```

## 🖥️ Equipos

### Obtener todos los equipos
```http
GET /api/equipos?search=pc&tipo_id=1&estado_id=1&page=1&limit=10
```

**Headers:**
```
Authorization: Bearer <token>
```

**Parámetros de consulta:**
- `search`: Búsqueda por nombre, número de serie, modelo o marca
- `tipo_id`: Filtrar por tipo de equipo
- `estado_id`: Filtrar por estado
- `ubicacion_id`: Filtrar por ubicación
- `usuario_id`: Filtrar por usuario asignado
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)

### Obtener equipo por ID
```http
GET /api/equipos/:id
```

### Crear equipo
```http
POST /api/equipos
```

**Body:**
```json
{
  "nombre": "Nueva PC",
  "numero_serie": "PC002-2024",
  "modelo": "OptiPlex 7090",
  "marca": "Dell",
  "observaciones": "Equipo para laboratorio",
  "fecha_adquisicion": "2024-01-15",
  "tipo_equipo_id": 1,
  "estado_id": 1,
  "ubicacion_id": 1,
  "usuario_asignado_id": 1
}
```

### Actualizar equipo
```http
PUT /api/equipos/:id
```

### Eliminar equipo
```http
DELETE /api/equipos/:id
```

### Obtener estadísticas
```http
GET /api/equipos/estadisticas
```

## 📋 Catálogos

### Tipos de Equipo

#### Obtener tipos
```http
GET /api/catalogos/tipos-equipo
```

#### Crear tipo
```http
POST /api/catalogos/tipos-equipo
```

**Body:**
```json
{
  "nombre": "Nuevo Tipo",
  "descripcion": "Descripción del nuevo tipo"
}
```

#### Actualizar tipo
```http
PUT /api/catalogos/tipos-equipo/:id
```

#### Eliminar tipo
```http
DELETE /api/catalogos/tipos-equipo/:id
```

### Estados de Equipo

#### Obtener estados
```http
GET /api/catalogos/estados-equipo
```

#### Crear estado
```http
POST /api/catalogos/estados-equipo
```

**Body:**
```json
{
  "estado": "Nuevo Estado",
  "descripcion": "Descripción del estado",
  "color": "#10B981"
}
```

#### Actualizar estado
```http
PUT /api/catalogos/estados-equipo/:id
```

#### Eliminar estado
```http
DELETE /api/catalogos/estados-equipo/:id
```

### Ubicaciones

#### Obtener ubicaciones
```http
GET /api/catalogos/ubicaciones
```

#### Crear ubicación
```http
POST /api/catalogos/ubicaciones
```

**Body:**
```json
{
  "edificio": "Edificio D",
  "sala": "Aula 201",
  "descripcion": "Aula de matemáticas"
}
```

#### Actualizar ubicación
```http
PUT /api/catalogos/ubicaciones/:id
```

#### Eliminar ubicación
```http
DELETE /api/catalogos/ubicaciones/:id
```

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

## 📊 Códigos de Estado HTTP

- `200`: OK - Operación exitosa
- `201`: Created - Recurso creado exitosamente
- `400`: Bad Request - Datos inválidos
- `401`: Unauthorized - No autenticado
- `403`: Forbidden - No autorizado
- `404`: Not Found - Recurso no encontrado
- `409`: Conflict - Conflicto (ej: registro duplicado)
- `500`: Internal Server Error - Error interno del servidor

## 🔧 Ejemplos de Uso

### Ejemplo: Obtener equipos con filtros
```javascript
const response = await fetch('/api/equipos?search=pc&tipo_id=1&page=1&limit=5', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

### Ejemplo: Crear un nuevo equipo
```javascript
const response = await fetch('/api/equipos', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre: 'Nueva PC',
    numero_serie: 'PC003-2024',
    modelo: 'ThinkCentre M90t',
    marca: 'Lenovo',
    tipo_equipo_id: 1,
    estado_id: 1,
    ubicacion_id: 1,
    observaciones: 'Equipo para laboratorio',
    usuario_asignado_id: 1,
    fecha_adquisicion: '2024-01-20'
  })
});

const data = await response.json();
console.log(data);
```

## 📎 Adjuntos de Solicitudes

### Obtener adjuntos de una solicitud
```http
GET /api/adjuntos/solicitud/:solicitud_id
```

**Headers:**
```
Authorization: Bearer <token>
```

### Subir adjunto a una solicitud
```http
POST /api/adjuntos/solicitud/:solicitud_id
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (FormData):**
```
archivo: <file>
descripcion: "Descripción opcional del archivo"
```

**Límites:**
- Tamaño máximo: 10MB
- Tipos permitidos: PDF, Word, Excel, imágenes, texto

### Descargar adjunto
```http
GET /api/adjuntos/:id/download
```

**Headers:**
```
Authorization: Bearer <token>
```

### Eliminar adjunto
```http
DELETE /api/adjuntos/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Notas:**
- Solo el propietario del archivo o administrador puede eliminarlo
- Al eliminar una solicitud, se eliminan automáticamente todos sus adjuntos

## 🚀 Inicio Rápido

1. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar migraciones:**
   ```bash
   npm run migrate
   ```

4. **Ejecutar seed (datos iniciales):**
   ```bash
   npm run seed
   ```

5. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

6. **Probar autenticación:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"usuario":"admin","contraseña":"Admin123"}'
   ```

## 📝 Notas

- Todas las fechas deben estar en formato ISO 8601 (YYYY-MM-DD)
- Los IDs son números enteros
- Los campos de texto tienen límites según el esquema de la base de datos
- Las respuestas incluyen siempre un campo `message` con información descriptiva
- Los errores incluyen detalles específicos cuando es posible
- Los archivos adjuntos se almacenan en `backend/uploads/adjuntos/` 