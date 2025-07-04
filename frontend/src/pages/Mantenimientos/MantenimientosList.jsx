import React, { useEffect, useState } from 'react';
import { getMantenimientos, deleteMantenimiento } from '../../services/mantenimientosService';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import MantenimientoForm from './MantenimientoForm';
import Button from '../../components/Button';

export default function MantenimientosList() {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [mantenimientoToDelete, setMantenimientoToDelete] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState({});
  const [error, setError] = useState('');

  const fetchMantenimientos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getMantenimientos();
      setMantenimientos(Array.isArray(res) ? res : []);
    } catch (err) {
      setError('Error al cargar los mantenimientos.');
      console.error('Error al cargar mantenimientos:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMantenimientos();
  }, []);

  const handleDelete = (mantenimiento) => {
    setMantenimientoToDelete(mantenimiento);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (mantenimientoToDelete) {
      try {
        await deleteMantenimiento(mantenimientoToDelete.id);
        setModalOpen(false);
        setMantenimientoToDelete(null);
        fetchMantenimientos();
      } catch (error) {
        console.error('Error al eliminar mantenimiento:', error);
        setError('Error al eliminar el mantenimiento.');
      }
    }
  };

  const handleAdd = () => {
    setFormInitialValues({});
    setFormOpen(true);
  };

  const handleEdit = (mantenimiento) => {
    setFormInitialValues(mantenimiento);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    fetchMantenimientos();
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'programado': return 'bg-blue-100 text-blue-800';
      case 'en_proceso': return 'bg-yellow-100 text-yellow-800';
      case 'completado': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'preventivo': return 'bg-green-100 text-green-800';
      case 'correctivo': return 'bg-red-100 text-red-800';
      case 'calibracion': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { 
      key: 'equipo', 
      label: 'Equipo',
      render: (mantenimiento) => mantenimiento.equipo?.nombre || 'N/A'
    },
    { 
      key: 'tipo_mantenimiento', 
      label: 'Tipo',
      render: (mantenimiento) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(mantenimiento.tipo_mantenimiento)}`}>
          {mantenimiento.tipo_mantenimiento}
        </span>
      )
    },
    { 
      key: 'fecha_mantenimiento', 
      label: 'Fecha',
      render: (mantenimiento) => new Date(mantenimiento.fecha_mantenimiento).toLocaleDateString('es-ES')
    },
    { 
      key: 'tecnico', 
      label: 'Técnico',
      render: (mantenimiento) => mantenimiento.tecnico?.nombre || 'N/A'
    },
    { 
      key: 'costo', 
      label: 'Costo',
      render: (mantenimiento) => mantenimiento.costo ? `$${mantenimiento.costo}` : 'N/A'
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (mantenimiento) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(mantenimiento.estado)}`}>
          {mantenimiento.estado}
        </span>
      )
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Gestión de Mantenimientos</h1>
        <Button onClick={handleAdd}>Nuevo Mantenimiento</Button>
      </div>
      
      {loading && <Loader />}
      {error && <div className="text-red-600 mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      
      {!loading && mantenimientos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No hay mantenimientos registrados</p>
        </div>
      )}
      
      {!loading && mantenimientos.length > 0 && (
        <Table 
          columns={columns} 
          data={mantenimientos} 
          loading={loading} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirmar eliminación">
        <p>¿Estás seguro de que deseas eliminar el mantenimiento del equipo <b>{mantenimientoToDelete?.equipo?.nombre}</b>?</p>
        <div className="flex gap-2 justify-end mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded bg-gray-200">Cancelar</button>
          <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-600 text-white font-bold">Eliminar</button>
        </div>
      </Modal>
      
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={formInitialValues.id ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}>
        <MantenimientoForm
          initialValues={formInitialValues}
          onSuccess={handleFormSuccess}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
    </>
  );
} 