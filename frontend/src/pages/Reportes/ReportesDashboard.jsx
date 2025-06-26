import React, { useState, useEffect } from 'react';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import Loader from '../../components/Loader.jsx';
import reportesService from '../../services/reportesService.js';

/**
 * ReportesDashboard: Componente para la interfaz de generación de reportes.
 * Permite ver una lista de reportes generados y opciones para exportar.
 */
const ReportesDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para cargar los reportes
  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportesService.getAll();
      setReports(data);
    } catch (err) {
      setError('Error al cargar reportes: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportPdf = async (reportId) => {
    try {
      setLoading(true);
      const response = await reportesService.exportPdf(reportId);
      // Asumiendo que la API devuelve un blob o una URL para descargar
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      alert('Reporte PDF generado y descargado.');
    } catch (err) {
      alert('Error al generar PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async (reportId) => {
    try {
      setLoading(true);
      const response = await reportesService.exportExcel(reportId);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${reportId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      alert('Reporte Excel generado y descargado.');
    } catch (err) {
      alert('Error al generar Excel: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Cargando reportes..." className="mt-8" />;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Reportes Generados</h3>
      {reports.length === 0 ? (
        <p className="text-gray-600">No hay reportes generados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Envío
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.usuario_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.fecha_envio}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white mr-2"
                      onClick={() => handleExportPdf(report.id)}
                    >
                      Exportar PDF
                    </Button>
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => handleExportExcel(report.id)}
                    >
                      Exportar Excel
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default ReportesDashboard;
