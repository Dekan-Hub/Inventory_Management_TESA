import React, { useEffect, useState } from 'react';
import { getReportes, createReporte, getReporte } from '../../services/reportesService';
import Table from '../../components/Table';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';

export default function ReportesDashboard() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [filtros, setFiltros] = useState({
    tipo_reporte: '',
    fecha_inicio: '',
    fecha_fin: ''
  });
  const [detalleReporte, setDetalleReporte] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);
  const [formato, setFormato] = useState('pdf');

  useEffect(() => {
    fetchReportes();
  }, []);

  const fetchReportes = async () => {
    setLoading(true);
    try {
      const res = await getReportes(filtros);
      setReportes(res.data?.data || []);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarReporte = async (tipo) => {
    setGenerating(true);
    try {
      const reporteData = {
        tipo_reporte: tipo,
        titulo: `Reporte de ${tipo}`,
        descripcion: `Reporte generado el ${new Date().toLocaleDateString()}`,
        parametros: filtros,
        formato
      };
      await createReporte(reporteData);
      setShowModal(false);
      fetchReportes();
    } catch (error) {
      alert('Error al generar reporte.');
      console.error('Error al generar reporte:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleVerDetalles = async (id) => {
    try {
      const res = await getReporte(id);
      setDetalleReporte(res.data?.data || null);
      setShowDetalle(true);
    } catch (error) {
      alert('No se pudo cargar el detalle del reporte.');
      console.error('Error al cargar el detalle del reporte:', error);
    }
  };

  const columns = [
    { 
      key: 'titulo', 
      label: 'Título',
      render: (row) => (
        <div>
          <div className="font-semibold">{row.titulo}</div>
          <div className="text-sm text-gray-500">{row.tipo_reporte}</div>
        </div>
      )
    },
    { 
      key: 'fecha_generacion', 
      label: 'Fecha de Generación',
      render: (row) => new Date(row.fecha_generacion).toLocaleDateString()
    },
    { 
      key: 'usuario_generador', 
      label: 'Generado por',
      render: (row) => row.generador?.nombre || 'Sistema'
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.estado === 'completado' ? 'bg-green-100 text-green-800' :
          row.estado === 'en_proceso' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.estado || 'pendiente'}
        </span>
      )
    },
    { 
      key: 'acciones', 
      label: 'Acciones',
      render: (row) => (
        <div className="flex gap-2">
          {row.ruta_archivo && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => window.open(`/api/reportes/${row.id}/download`, '_blank')}
            >
              Descargar
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleVerDetalles(row.id)}
          >
            Detalles
          </Button>
        </div>
      )
    },
  ];

  const tiposReporte = [
    { value: 'inventario', label: 'Inventario de Equipos' },
    { value: 'mantenimientos', label: 'Mantenimientos Realizados' },
    { value: 'movimientos', label: 'Movimientos de Equipos' },
    { value: 'solicitudes', label: 'Solicitudes del Sistema' },
    { value: 'personalizado', label: 'Reporte Personalizado' }
  ];

  // Estadísticas
  const total = reportes.length;
  const completados = reportes.filter(r => r.estado === 'completado').length;
  const enProceso = reportes.filter(r => r.estado === 'en_proceso').length;
  const pendientes = reportes.filter(r => !r.estado || r.estado === 'pendiente').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reportes</h2>
          <p className="text-gray-600">Genera y gestiona reportes del sistema</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          variant="primary"
        >
          Generar Nuevo Reporte
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{total}</div>
            <div className="text-sm text-gray-600">Total de Reportes</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completados}</div>
            <div className="text-sm text-gray-600">Completados</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{enProceso}</div>
            <div className="text-sm text-gray-600">En Proceso</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{pendientes}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
        </Card>
      </div>

      {/* Tabla de Reportes */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Reportes Generados</h3>
          <div className="flex gap-4 mb-4">
            <select
              value={filtros.tipo_reporte}
              onChange={(e) => setFiltros({...filtros, tipo_reporte: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Todos los tipos</option>
              {tiposReporte.map(tipo => (
                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
              ))}
            </select>
            <input
              type="date"
              value={filtros.fecha_inicio}
              onChange={(e) => setFiltros({...filtros, fecha_inicio: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="Fecha inicio"
            />
            <input
              type="date"
              value={filtros.fecha_fin}
              onChange={(e) => setFiltros({...filtros, fecha_fin: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="Fecha fin"
            />
            <Button
              onClick={fetchReportes}
              variant="secondary"
              size="sm"
            >
              Filtrar
            </Button>
          </div>
        </div>
        <Table 
          columns={columns} 
          data={reportes} 
          loading={loading}
          emptyMessage="No hay reportes generados"
        />
      </Card>

      {/* Modal para generar reporte */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Generar Nuevo Reporte"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Reporte
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={filtros.tipo_reporte}
              onChange={(e) => setFiltros({...filtros, tipo_reporte: e.target.value})}
            >
              <option value="">Seleccionar tipo...</option>
              {tiposReporte.map(tipo => (
                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formato}
              onChange={e => setFormato(e.target.value)}
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filtros.fecha_inicio}
                onChange={(e) => setFiltros({...filtros, fecha_inicio: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                value={filtros.fecha_fin}
                onChange={(e) => setFiltros({...filtros, fecha_fin: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={() => setShowModal(false)}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => handleGenerarReporte(filtros.tipo_reporte)}
              variant="primary"
              disabled={!filtros.tipo_reporte || generating}
            >
              {generating ? 'Generando...' : 'Generar Reporte'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Detalles */}
      <Modal
        open={showDetalle}
        onClose={() => setShowDetalle(false)}
        title="Detalle del Reporte"
      >
        {detalleReporte ? (
          <div className="space-y-2">
            <div><b>Título:</b> {detalleReporte.titulo}</div>
            <div><b>Tipo:</b> {detalleReporte.tipo_reporte}</div>
            <div><b>Descripción:</b> {detalleReporte.descripcion}</div>
            <div><b>Generado por:</b> {detalleReporte.generador?.nombre || 'Sistema'}</div>
            <div><b>Fecha de generación:</b> {new Date(detalleReporte.fecha_generacion).toLocaleString()}</div>
            <div><b>Estado:</b> {detalleReporte.estado || 'pendiente'}</div>
            {detalleReporte.ruta_archivo && (
              <div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => window.open(`/api/reportes/${detalleReporte.id}/download`, '_blank')}
                >
                  Descargar
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div>No se pudo cargar el detalle.</div>
        )}
      </Modal>
    </div>
  );
} 