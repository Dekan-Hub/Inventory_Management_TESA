# Backend - Sistema de Inventario TESA

## Funcionalidades principales

- Gestión de usuarios, roles y autenticación JWT
- Gestión de equipos, tipos, estados y ubicaciones
- Mantenimientos, movimientos y solicitudes con control de permisos
- Adjuntos en solicitudes y reportes
- Generación y gestión de reportes del sistema (inventario, mantenimientos, movimientos, solicitudes, personalizado)
- Generación real de archivos PDF y Excel con datos reales y logo institucional
- Descarga de reportes en PDF o Excel (si el archivo está disponible)
- API RESTful documentada en `/docs/API.md`
- Control de logs y auditoría

## Endpoints principales

- `/api/usuarios` CRUD de usuarios
- `/api/equipos` CRUD de equipos
- `/api/mantenimientos` CRUD de mantenimientos
- `/api/movimientos` CRUD de movimientos
- `/api/solicitudes` CRUD de solicitudes
- `/api/alertas` CRUD de alertas
- `/api/reportes` CRUD de reportes y descarga de archivos
- `/api/auth` Autenticación y perfil

## Reportes

- Listado y filtrado de reportes generados
- Generación de nuevos reportes por tipo, rango de fechas y formato (PDF o Excel)
- Visualización de detalles de cada reporte
- Descarga de archivos generados (PDF/Excel) si están disponibles

## Estructura de archivos

- `controllers/` Lógica de negocio y endpoints
- `models/` Definición de modelos y relaciones
- `routes/` Definición de rutas API
- `migrations/` Migraciones de base de datos
- `seeders/` Datos de ejemplo
- `utils/` Utilidades y helpers

## Requisitos

- Node.js 18+
- MySQL/MariaDB
- Variables de entorno en `.env`

## Ejecución

```bash
npm install
npm run migrate
npm run seed
npm start
``` 