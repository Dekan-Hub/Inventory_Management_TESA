import React, { useEffect, useState } from 'react';
import { getMovimientos, deleteMovimiento } from '../../services/movimientosService';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import MovimientoForm from './MovimientoForm';
import Button from '../../components/Button';

export default function MovimientosList() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [movimientoToDelete, setMovimientoToDelete] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState({});
  const [error, setError] = useState('');

  const fetchMovimientos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getMovimientos();
      setMovimientos(Array.isArray(res) ? res : []);
    } catch (err) {
      setError('Error al cargar los movimientos.');
      console.error('Error al cargar movimientos:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const handleDelete = (movimiento) => {
    setMovimientoToDelete(movimiento);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (movimientoToDelete) {
      try {
        await deleteMovimiento(movimientoToDelete.id);
        setModalOpen(false);
        setMovimientoToDelete(null);
        fetchMovimientos();
      } catch (error) {
        console.error('Error al eliminar movimiento:', error);
        setError('Error al eliminar el movimiento.');
      }
    }
  };

  const handleAdd = () => {
    setFormInitialValues({});
    setFormOpen(true);
  };

  const handleEdit = (movimiento) => {
    setFormInitialValues(movimiento);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    fetchMovimientos();
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'aprobado': return 'bg-green-100 text-green-800';
      case 'rechazado': return 'bg-red-100 text-red-800';
      case 'completado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { 
      key: 'equipo', 
      label: 'Equipo',
      render: (movimiento) => movimiento.equipo?.nombre || 'N/A'
    },
    { 
      key: 'ubicacionOrigen', 
      label: 'Origen',
      render: (movimiento) => movimiento.ubicacionOrigen ? `${movimiento.ubicacionOrigen.edificio} - ${movimiento.ubicacionOrigen.sala}` : 'N/A'
    },
    { 
      key: 'ubicacionDestino', 
      label: 'Destino',
      render: (movimiento) => movimiento.ubicacionDestino ? `${movimiento.ubicacionDestino.edificio} - ${movimiento.ubicacionDestino.sala}` : 'N/A'
    },
    { 
      key: 'fecha_movimiento', 
      label: 'Fecha',
      render: (movimiento) => new Date(movimiento.fecha_movimiento).toLocaleDateString('es-ES')
    },
    { 
      key: 'responsable', 
      label: 'Responsable',
      render: (movimiento) => movimiento.responsable?.nombre || 'N/A'
    },
    { 
      key: 'motivo', 
      label: 'Motivo',
      render: (movimiento) => movimiento.motivo?.substring(0, 50) + (movimiento.motivo?.length > 50 ? '...' : '') || 'N/A'
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (movimiento) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(movimiento.estado)}`}>
          {movimiento.estado}
        </span>
      )
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Gestión de Movimientos</h1>
        <Button onClick={handleAdd}>Nuevo Movimiento</Button>
      </div>
      
      {loading && <Loader />}
      {error && <div className="text-red-600 mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      
      {!loading && movimientos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No hay movimientos registrados</p>
        </div>
      )}
      
      {!loading && movimientos.length > 0 && (
        <Table 
          columns={columns} 
          data={movimientos} 
          loading={loading} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirmar eliminación">
        <p>¿Estás seguro de que deseas eliminar el movimiento del equipo <b>{movimientoToDelete?.equipo?.nombre}</b>?</p>
        <div className="flex gap-2 justify-end mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded bg-gray-200">Cancelar</button>
          <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-600 text-white font-bold">Eliminar</button>
        </div>
      </Modal>
      
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={formInitialValues.id ? 'Editar Movimiento' : 'Nuevo Movimiento'}>
        <MovimientoForm
          initialValues={formInitialValues}
          onSuccess={handleFormSuccess}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
    </>
  );
} 