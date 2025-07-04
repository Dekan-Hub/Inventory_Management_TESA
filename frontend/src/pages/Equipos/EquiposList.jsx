import React, { useEffect, useState } from 'react';
import { getEquipos, deleteEquipo } from '../../services/equiposService';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import EquipoForm from './EquipoForm';
import Button from '../../components/Button';

export default function EquiposList() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [equipoToDelete, setEquipoToDelete] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState({});
  const [error, setError] = useState('');

  const fetchEquipos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getEquipos();
      setEquipos(Array.isArray(res) ? res : []);
    } catch (err) {
      setError('Error al cargar los equipos.');
      console.error('Error al cargar equipos:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

  const handleDelete = (equipo) => {
    setEquipoToDelete(equipo);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (equipoToDelete) {
      try {
        await deleteEquipo(equipoToDelete.id);
        setModalOpen(false);
        setEquipoToDelete(null);
        fetchEquipos();
      } catch (error) {
        console.error('Error al eliminar equipo:', error);
        setError('Error al eliminar el equipo.');
      }
    }
  };

  const handleAdd = () => {
    setFormInitialValues({});
    setFormOpen(true);
  };

  const handleEdit = (equipo) => {
    setFormInitialValues(equipo);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    fetchEquipos();
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'numero_serie', label: 'Número de Serie' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'marca', label: 'Marca' },
    { 
      key: 'tipoEquipo', 
      label: 'Tipo',
      render: (equipo) => equipo.tipoEquipo?.nombre || 'N/A'
    },
    { 
      key: 'estadoEquipo', 
      label: 'Estado',
      render: (equipo) => equipo.estadoEquipo?.estado || 'N/A'
    },
    { 
      key: 'ubicacion', 
      label: 'Ubicación',
      render: (equipo) => equipo.ubicacion ? `${equipo.ubicacion.edificio} - ${equipo.ubicacion.sala}` : 'N/A'
    },
    { 
      key: 'usuarioAsignado', 
      label: 'Usuario Asignado',
      render: (equipo) => equipo.usuarioAsignado?.nombre || 'Sin asignar'
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Gestión de Equipos</h1>
        <Button onClick={handleAdd}>Nuevo Equipo</Button>
      </div>
      
      {loading && <Loader />}
      {error && <div className="text-red-600 mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      
      {!loading && equipos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No hay equipos registrados</p>
        </div>
      )}
      
      {!loading && equipos.length > 0 && (
        <Table 
          columns={columns} 
          data={equipos} 
          loading={loading} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirmar eliminación">
        <p>¿Estás seguro de que deseas eliminar el equipo <b>{equipoToDelete?.nombre}</b>?</p>
        <div className="flex gap-2 justify-end mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded bg-gray-200">Cancelar</button>
          <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-600 text-white font-bold">Eliminar</button>
        </div>
      </Modal>
      
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={formInitialValues.id ? 'Editar Equipo' : 'Nuevo Equipo'}>
        <EquipoForm
          initialValues={formInitialValues}
          onSuccess={handleFormSuccess}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
    </>
  );
} 