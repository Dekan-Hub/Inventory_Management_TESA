/**
 * @file Controlador para la generación y gestión de reportes.
 * @description Maneja la lógica para generar diferentes tipos de reportes (ej. inventario, mantenimientos)
 * y exportarlos en formatos como Excel o PDF, utilizando las utilidades `exports` y `utils/reportGenerator.js`.
 */

const { Equipo, Mantenimiento, Solicitud, Usuario, Reporte } = require('../models'); // Importa los modelos necesarios
const { Op } = require('sequelize');
const path = require('path'); // Para manejar rutas de archivos
const fs = require('fs'); // Para manejar archivos

// Asumiendo que tienes una utilidad para generar reportes en `backend/utils/reportGenerator.js`
// Necesitarás implementar esta utilidad si aún no lo has hecho.
// Por ejemplo, para generar un Excel simple:
// const reportGenerator = require('../utils/reportGenerator'); // Esto lo haremos después

/**
 * @function generarReporteInventario
 * @description Genera un reporte del inventario de equipos, con opción de filtrado y exportación.
 * Guarda un registro en la tabla `Reporte`.
 * @param {object} req - Objeto de la petición. Permite filtrar por tipo, estado, ubicación, usuario asignado.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.generarReporteInventario = async (req, res, next) => {
  try {
    const { tipo, estado, ubicacion, usuarioAsignado, formato = 'Excel' } = req.query; // Formato por defecto Excel
    const id_usuario_genera = req.usuario ? req.usuario.id : null; // Obtiene el ID del usuario autenticado, si existe

    const whereClause = {};
    if (tipo) whereClause.id_tipo_equipo = tipo;
    if (estado) whereClause.id_estado_equipo = estado;
    if (ubicacion) whereClause.id_ubicacion = ubicacion;
    if (usuarioAsignado) whereClause.id_usuario_asignado = usuarioAsignado;

    const equipos = await Equipo.findAll({
      where: whereClause,
      include: [
        { model: TipoEquipo, as: 'tipo', attributes: ['nombre_tipo'] },
        { model: EstadoEquipo, as: 'estado', attributes: ['nombre_estado'] },
        { model: Ubicacion, as: 'ubicacion', attributes: ['nombre_ubicacion'] },
        { model: Usuario, as: 'usuarioAsignado', attributes: ['nombre_usuario', 'correo'], required: false }
      ],
      order: [['codigo_inventario', 'ASC']]
    });

    if (equipos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron equipos para generar el reporte con los criterios dados.' });
    }

    // --- Lógica de generación y exportación del reporte ---
    // Esta parte requiere la implementación de `reportGenerator.js`
    let filePath;
    let fileName;
    let mimetype;

    if (formato.toLowerCase() === 'excel') {
      fileName = `reporte_inventario_${Date.now()}.xlsx`;
      filePath = path.join(__dirname, '../exports', fileName);
      mimetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      // **Aquí llamarías a tu función de generación de Excel**
      // Por ejemplo: await reportGenerator.generateExcel(equipos, filePath, 'Inventario');
      // Por ahora, solo un placeholder:
      fs.writeFileSync(filePath, 'Contenido de prueba Excel', 'utf8'); // Crea un archivo dummy
      console.log(`[DEBUG] Archivo Excel de prueba creado en: ${filePath}`);

    } else if (formato.toLowerCase() === 'pdf') {
      fileName = `reporte_inventario_${Date.now()}.pdf`;
      filePath = path.join(__dirname, '../exports', fileName);
      mimetype = 'application/pdf';

      // **Aquí llamarías a tu función de generación de PDF**
      // Por ejemplo: await reportGenerator.generatePdf(equipos, filePath, 'Inventario');
      // Por ahora, solo un placeholder:
      fs.writeFileSync(filePath, 'Contenido de prueba PDF', 'utf8'); // Crea un archivo dummy
      console.log(`[DEBUG] Archivo PDF de prueba creado en: ${filePath}`);

    } else {
      return res.status(400).json({ message: 'Formato de exportación no válido. Use "Excel" o "PDF".' });
    }

    // Guardar registro del reporte generado
    if (id_usuario_genera) {
      await Reporte.create({
        nombre_reporte: `Reporte de Inventario (${formato})`,
        tipo_exportacion: formato.toUpperCase(),
        ruta_archivo: filePath,
        id_usuario_genera: id_usuario_genera,
        filtros_aplicados: req.query // Guarda los filtros aplicados
      });
    }

    // Enviar el archivo para descarga
    res.download(filePath, fileName, (err) => {
      if (err) {
        // Manejar errores de descarga, por ejemplo, si el cliente desconecta
        console.error('Error al enviar el archivo para descarga:', err);
        // Opcional: eliminar el archivo si hubo un error en la descarga para no dejar basura
        // fs.unlink(filePath, (unlinkErr) => { if (unlinkErr) console.error('Error al eliminar archivo:', unlinkErr); });
        next(err); // Pasa el error al middleware de errores
      } else {
        // Opcional: eliminar el archivo después de enviarlo si no se necesita persistir
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error('Error al eliminar archivo temporal:', unlinkErr);
        });
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @function obtenerReportesGenerados
 * @description Obtiene una lista de los reportes que han sido generados y registrados.
 * @param {object} req - Objeto de la petición.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
exports.obtenerReportesGenerados = async (req, res, next) => {
  try {
    const reportes = await Reporte.findAll({
      include: [
        { model: Usuario, as: 'generador', attributes: ['nombre_usuario', 'correo'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (reportes.length === 0) {
      return res.status(404).json({ message: 'No hay reportes generados registrados.' });
    }

    res.status(200).json({
      message: 'Reportes generados obtenidos exitosamente.',
      total: reportes.length,
      reportes: reportes
    });
  } catch (error) {
    next(error);
  }
};