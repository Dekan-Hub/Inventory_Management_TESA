import React, { useEffect, useState } from 'react';
import { getSolicitudes, deleteSolicitud } from '../../services/solicitudesService';
import { useAuth } from '../../context/AuthContext';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import SolicitudForm from './SolicitudForm';
import ResponderSolicitudForm from './ResponderSolicitudForm';
import Button from '../../components/Button';

export default function SolicitudesList() {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [solicitudToDelete, setSolicitudToDelete] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState({});
  const [responderOpen, setResponderOpen] = useState(false);
  const [solicitudToRespond, setSolicitudToRespond] = useState(null);
  const [error, setError] = useState('');

  const fetchSolicitudes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getSolicitudes();
      setSolicitudes(Array.isArray(res) ? res : []);
    } catch (err) {
      setError('Error al cargar las solicitudes.');
      console.error('Error al cargar solicitudes:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const handleDelete = (solicitud) => {
    setSolicitudToDelete(solicitud);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (solicitudToDelete) {
      try {
        await deleteSolicitud(solicitudToDelete.id);
        setModalOpen(false);
        setSolicitudToDelete(null);
        fetchSolicitudes();
      } catch (error) {
        console.error('Error al eliminar solicitud:', error);
        setError('Error al eliminar la solicitud.');
      }
    }
  };

  const handleAdd = () => {
    setFormInitialValues({});
    setFormOpen(true);
  };

  const handleEdit = (solicitud) => {
    setFormInitialValues(solicitud);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    fetchSolicitudes();
  };

  const handleResponder = (solicitud) => {
    setSolicitudToRespond(solicitud);
    setResponderOpen(true);
  };

  const handleResponderSuccess = () => {
    setResponderOpen(false);
    setSolicitudToRespond(null);
    fetchSolicitudes();
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'aprobada': return 'bg-green-100 text-green-800';
      case 'rechazada': return 'bg-red-100 text-red-800';
      case 'en_proceso': return 'bg-blue-100 text-blue-800';
      case 'completada': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'nuevo_equipo': return 'bg-blue-100 text-blue-800';
      case 'mantenimiento': return 'bg-orange-100 text-orange-800';
      case 'movimiento': return 'bg-green-100 text-green-800';
      case 'otro': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { 
      key: 'titulo', 
      label: 'Título',
      render: (solicitud) => solicitud.titulo || 'N/A'
    },
    { 
      key: 'tipo_solicitud', 
      label: 'Tipo',
      render: (solicitud) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(solicitud.tipo_solicitud)}`}>
          {solicitud.tipo_solicitud}
        </span>
      )
    },
    { 
      key: 'solicitante', 
      label: 'Solicitante',
      render: (solicitud) => solicitud.solicitante?.nombre || 'N/A'
    },
    { 
      key: 'equipo', 
      label: 'Equipo',
      render: (solicitud) => solicitud.equipo?.nombre || 'Sin equipo'
    },
    { 
      key: 'fecha_solicitud', 
      label: 'Fecha',
      render: (solicitud) => new Date(solicitud.fecha_solicitud).toLocaleDateString('es-ES')
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (solicitud) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(solicitud.estado)}`}>
          {solicitud.estado}
        </span>
      )
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Gestión de Solicitudes</h1>
        <Button onClick={handleAdd}>Nueva Solicitud</Button>
      </div>
      
      {loading && <Loader />}
      {error && <div className="text-red-600 mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      
      {!loading && solicitudes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No hay solicitudes registradas</p>
        </div>
      )}
      
      {!loading && solicitudes.length > 0 && (
        <Table 
          columns={columns} 
          data={solicitudes} 
          loading={loading} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          onResponder={user?.rol === 'administrador' ? handleResponder : undefined}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirmar eliminación">
        <p>¿Estás seguro de que deseas eliminar la solicitud <b>{solicitudToDelete?.titulo}</b>?</p>
        <div className="flex gap-2 justify-end mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded bg-gray-200">Cancelar</button>
          <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-600 text-white font-bold">Eliminar</button>
        </div>
      </Modal>
      
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={formInitialValues.id ? 'Editar Solicitud' : 'Nueva Solicitud'}>
        <SolicitudForm
          initialValues={formInitialValues}
          onSuccess={handleFormSuccess}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
      
      <Modal open={responderOpen} onClose={() => setResponderOpen(false)} title="Responder Solicitud">
        <ResponderSolicitudForm
          solicitud={solicitudToRespond}
          onSuccess={handleResponderSuccess}
          onCancel={() => setResponderOpen(false)}
        />
      </Modal>
    </>
  );
} 