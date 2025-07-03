const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Equipo, Mantenimiento, Movimiento, Solicitud, Alerta, Usuario } = require('../models');
const logger = require('./logger');

class ReportGenerator {
  constructor() {
    this.reportsDir = path.join(__dirname, '../reports');
    this.ensureReportsDirectory();
  }

  ensureReportsDirectory() {
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  /**
   * Generar reporte de equipos en Excel
   */
  async generateEquiposExcel(filters = {}) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Equipos');

      // Configurar columnas
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Código', key: 'codigo', width: 15 },
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Marca', key: 'marca', width: 20 },
        { header: 'Modelo', key: 'modelo', width: 20 },
        { header: 'Tipo', key: 'tipo', width: 20 },
        { header: 'Estado', key: 'estado', width: 20 },
        { header: 'Ubicación', key: 'ubicacion', width: 25 },
        { header: 'Fecha Adquisición', key: 'fecha_adquisicion', width: 20 },
        { header: 'Valor', key: 'valor_adquisicion', width: 15 }
      ];

      // Obtener datos
      const equipos = await Equipo.findAll({
        where: filters,
        include: [
          { model: require('../models').TipoEquipo, as: 'tipo_equipo' },
          { model: require('../models').EstadoEquipo, as: 'estado_equipo' },
          { model: require('../models').Ubicacion, as: 'ubicacion' }
        ]
      });

      // Agregar datos
      equipos.forEach(equipo => {
        worksheet.addRow({
          id: equipo.id,
          codigo: equipo.codigo,
          nombre: equipo.nombre,
          marca: equipo.marca,
          modelo: equipo.modelo,
          tipo: equipo.tipo_equipo?.nombre || '',
          estado: equipo.estado_equipo?.nombre || '',
          ubicacion: equipo.ubicacion?.nombre || '',
          fecha_adquisicion: equipo.fecha_adquisicion ? new Date(equipo.fecha_adquisicion).toLocaleDateString() : '',
          valor_adquisicion: equipo.valor_adquisicion || 0
        });
      });

      // Estilo para encabezados
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      const filename = `equipos_${new Date().toISOString().split('T')[0]}.xlsx`;
      const filepath = path.join(this.reportsDir, filename);
      
      await workbook.xlsx.writeFile(filepath);
      
      logger.info(`Reporte Excel de equipos generado: ${filepath}`);
      return { filename, filepath };
    } catch (error) {
      logger.error('Error generando reporte Excel de equipos:', error);
      throw error;
    }
  }

  /**
   * Generar reporte de mantenimientos en Excel
   */
  async generateMantenimientosExcel(filters = {}) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Mantenimientos');

      // Configurar columnas
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Equipo', key: 'equipo', width: 20 },
        { header: 'Tipo', key: 'tipo_mantenimiento', width: 20 },
        { header: 'Descripción', key: 'descripcion', width: 40 },
        { header: 'Estado', key: 'estado', width: 15 },
        { header: 'Fecha', key: 'fecha_mantenimiento', width: 20 },
        { header: 'Costo', key: 'costo', width: 15 },
        { header: 'Técnico', key: 'tecnico', width: 25 }
      ];

      // Obtener datos
      const mantenimientos = await Mantenimiento.findAll({
        where: filters,
        include: [
          { model: Equipo, as: 'equipo', attributes: ['codigo', 'nombre'] },
          { model: Usuario, as: 'tecnico', attributes: ['nombre', 'apellido'] }
        ],
        order: [['fecha_mantenimiento', 'DESC']]
      });

      // Agregar datos
      mantenimientos.forEach(mantenimiento => {
        worksheet.addRow({
          id: mantenimiento.id,
          equipo: `${mantenimiento.equipo?.codigo} - ${mantenimiento.equipo?.nombre}`,
          tipo_mantenimiento: mantenimiento.tipo_mantenimiento,
          descripcion: mantenimiento.descripcion,
          estado: mantenimiento.estado,
          fecha_mantenimiento: new Date(mantenimiento.fecha_mantenimiento).toLocaleDateString(),
          costo: mantenimiento.costo || 0,
          tecnico: `${mantenimiento.tecnico?.nombre} ${mantenimiento.tecnico?.apellido}`
        });
      });

      // Estilo para encabezados
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      const filename = `mantenimientos_${new Date().toISOString().split('T')[0]}.xlsx`;
      const filepath = path.join(this.reportsDir, filename);
      
      await workbook.xlsx.writeFile(filepath);
      
      logger.info(`Reporte Excel de mantenimientos generado: ${filepath}`);
      return { filename, filepath };
    } catch (error) {
      logger.error('Error generando reporte Excel de mantenimientos:', error);
      throw error;
    }
  }

  /**
   * Generar reporte de equipos en PDF
   */
  async generateEquiposPDF(filters = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        const filename = `equipos_${new Date().toISOString().split('T')[0]}.pdf`;
        const filepath = path.join(this.reportsDir, filename);
        
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(filepath);
        
        doc.pipe(stream);

        // Título
        doc.fontSize(20).text('Reporte de Equipos', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generado el: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(2);

        // Obtener datos
        const equipos = await Equipo.findAll({
          where: filters,
          include: [
            { model: require('../models').TipoEquipo, as: 'tipo_equipo' },
            { model: require('../models').EstadoEquipo, as: 'estado_equipo' },
            { model: require('../models').Ubicacion, as: 'ubicacion' }
          ]
        });

        // Tabla de equipos
        let yPosition = doc.y;
        const startX = 50;
        const columnWidth = 100;

        // Encabezados
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Código', startX, yPosition);
        doc.text('Nombre', startX + columnWidth, yPosition);
        doc.text('Estado', startX + columnWidth * 2, yPosition);
        doc.text('Ubicación', startX + columnWidth * 3, yPosition);

        yPosition += 20;

        // Datos
        doc.fontSize(9).font('Helvetica');
        equipos.forEach((equipo, index) => {
          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
          }

          doc.text(equipo.codigo, startX, yPosition);
          doc.text(equipo.nombre.substring(0, 20), startX + columnWidth, yPosition);
          doc.text(equipo.estado_equipo?.nombre || '', startX + columnWidth * 2, yPosition);
          doc.text(equipo.ubicacion?.nombre || '', startX + columnWidth * 3, yPosition);

          yPosition += 15;
        });

        // Resumen
        doc.addPage();
        doc.fontSize(16).text('Resumen', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Total de equipos: ${equipos.length}`);
        doc.text(`Equipos activos: ${equipos.filter(e => e.estado_actual === 'Activo').length}`);
        doc.text(`Equipos en mantenimiento: ${equipos.filter(e => e.estado_actual === 'En Mantenimiento').length}`);

        doc.end();

        stream.on('finish', () => {
          logger.info(`Reporte PDF de equipos generado: ${filepath}`);
          resolve({ filename, filepath });
        });

        stream.on('error', reject);
      } catch (error) {
        logger.error('Error generando reporte PDF de equipos:', error);
        reject(error);
      }
    });
  }

  /**
   * Generar reporte de estadísticas en Excel
   */
  async generateStatsExcel() {
    try {
      const workbook = new ExcelJS.Workbook();
      
      // Hoja de resumen
      const summarySheet = workbook.addWorksheet('Resumen');
      summarySheet.columns = [
        { header: 'Métrica', key: 'metric', width: 30 },
        { header: 'Valor', key: 'value', width: 20 }
      ];

      const [
        totalEquipos,
        equiposActivos,
        totalMantenimientos,
        mantenimientosPendientes,
        totalSolicitudes,
        solicitudesPendientes,
        totalAlertas,
        alertasActivas
      ] = await Promise.all([
        Equipo.count(),
        Equipo.count({ where: { estado_actual: 'Activo' } }),
        Mantenimiento.count(),
        Mantenimiento.count({ where: { estado: 'programado' } }),
        Solicitud.count(),
        Solicitud.count({ where: { estado: 'pendiente' } }),
        Alerta.count(),
        Alerta.count({ where: { estado: 'activa' } })
      ]);

      const summaryData = [
        { metric: 'Total de Equipos', value: totalEquipos },
        { metric: 'Equipos Activos', value: equiposActivos },
        { metric: 'Total de Mantenimientos', value: totalMantenimientos },
        { metric: 'Mantenimientos Pendientes', value: mantenimientosPendientes },
        { metric: 'Total de Solicitudes', value: totalSolicitudes },
        { metric: 'Solicitudes Pendientes', value: solicitudesPendientes },
        { metric: 'Total de Alertas', value: totalAlertas },
        { metric: 'Alertas Activas', value: alertasActivas }
      ];

      summaryData.forEach(row => {
        summarySheet.addRow(row);
      });

      // Estilo para encabezados
      summarySheet.getRow(1).font = { bold: true };
      summarySheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      const filename = `estadisticas_${new Date().toISOString().split('T')[0]}.xlsx`;
      const filepath = path.join(this.reportsDir, filename);
      
      await workbook.xlsx.writeFile(filepath);
      
      logger.info(`Reporte Excel de estadísticas generado: ${filepath}`);
      return { filename, filepath };
    } catch (error) {
      logger.error('Error generando reporte Excel de estadísticas:', error);
      throw error;
    }
  }
}

module.exports = new ReportGenerator(); 