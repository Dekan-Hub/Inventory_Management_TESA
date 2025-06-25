import React, { useState, useEffect, useCallback, useContext } from 'react';
import { getSolicitudes, deleteSolicitud, updateSolicitud } from '../../services/solicitudesService';
import SolicitudForm from './SolicitudForm';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Table from '../../components/Table';
import Loader from '../../components/Loader';
import { AuthContext } from '../../context/AuthContext';

/**
 * SolicitudesList: Componente de la página de gestión de solicitudes.
 * Muestra una tabla con la lista de solicitudes y permite agregar, editar, eliminar y cambiar el estado.
 */
const SolicitudesList = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSolicitud, setCurrentSolicitud] = useState(null);
    const [modalType, setModalType] = useState('add'); // 'add' o 'edit'
    const [solicitudIdToDelete, setSolicitudIdToDelete] = useState(null);
    const { setGlobalMessage } = useContext(AuthContext);

    const fetchSolicitudes = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getSolicitudes();
            setSolicitudes(data);
        } catch (err) {
            console.error('Error fetching solicitudes:', err);
            setGlobalMessage({ message: `Error al cargar solicitudes: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [setGlobalMessage]);

    useEffect(() => {
        fetchSolicitudes();
    }, [fetchSolicitudes]);

    const handleAddSolicitud = () => {
        setCurrentSolicitud({ usuario: '', equipo: '', motivo: '', estado: 'Pendiente' });
        setModalType('add');
        setIsModalOpen(true);
    };

    const handleEditSolicitud = (solicitud) => {
        setCurrentSolicitud({ ...solicitud });
        setModalType('edit');
        setIsModalOpen(true);
    };

    const handleDeleteSolicitud = (id) => {
        setSolicitudIdToDelete(id);
        setGlobalMessage({
            message: `¿Estás seguro de que quieres eliminar esta solicitud (ID: ${id.substring(0, 8)}...)?`,
            type: 'confirm',
            onConfirm: confirmDelete
        });
    };

    const confirmDelete = async () => {
        if (!solicitudIdToDelete) return;

        setGlobalMessage({ message: '', type: '' });
        setIsLoading(true);
        try {
            await deleteSolicitud(solicitudIdToDelete);
            setGlobalMessage({ message: 'Solicitud eliminada exitosamente.', type: 'success' });
            fetchSolicitudes();
        } catch (err) {
            console.error('Error deleting solicitud:', err);
            setGlobalMessage({ message: `Error al eliminar solicitud: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
            setSolicitudIdToDelete(null);
        }
    };

    const handleStatusChange = async (solicitudId, newStatus) => {
        setIsLoading(true);
        try {
            await updateSolicitud(solicitudId, { estado: newStatus });
            setGlobalMessage({ message: `Estado de solicitud actualizado a ${newStatus}.`, type: 'success' });
            fetchSolicitudes();
        } catch (err) {
            console.error('Error updating solicitud status:', err);
            setGlobalMessage({ message: `Error al actualizar estado: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSolicitudSaved = (success, msg) => {
        setIsModalOpen(false);
        setGlobalMessage({ message: msg, type: success ? 'success' : 'error' });
        if (success) {
            fetchSolicitudes();
        }
    };

    const columns = [
        { header: 'ID', accessor: '_id', render: (row) => row._id.substring(0, 8) + '...' },
        { header: 'Usuario', accessor: 'usuario' },
        { header: 'Equipo Solicitado', accessor: 'equipo' },
        { header: 'Motivo', accessor: 'motivo' },
        {
            header: 'Estado',
            accessor: 'estado',
            render: (row) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    row.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    row.estado === 'Aprobada' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {row.estado}
                </span>
            ),
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button onClick={() => handleEditSolicitud(row)} className="p-1" variant="secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" />
                        </svg>
                    </Button>
                    <Button onClick={() => handleDeleteSolicitud(row._id)} className="p-1" variant="danger">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                        </svg>
                    </Button>
                    {row.estado === 'Pendiente' && (
                        <select
                            className="ml-2 border border-gray-300 rounded-md p-1 text-sm bg-white"
                            onChange={(e) => handleStatusChange(row._id, e.target.value)}
                            value={row.estado}
                        >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Aprobada">Aprobar</option>
                            <option value="Rechazada">Rechazar</option>
                        </select>
                    )}
                </div>
            ),
        },
    ];

    if (isLoading) return <Loader fullScreen message="Cargando solicitudes..." />;

    return (
        <div className="p-6 bg-gray-100 flex-1 overflow-y-auto rounded-lg font-inter">
            <Header
                title="Gestión de Solicitudes"
                subtitle="Administra las solicitudes de equipos de los usuarios."
            >
                <Button onClick={handleAddSolicitud} variant="primary" className="px-5 py-2">
                    + Nueva Solicitud
                </Button>
            </Header>

            <Card>
                <Table
                    columns={columns}
                    data={solicitudes}
                    emptyMessage="No hay solicitudes disponibles."
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalType === 'add' ? 'Crear Nueva Solicitud' : 'Editar Solicitud'}
            >
                <SolicitudForm
                    solicitud={currentSolicitud}
                    modalType={modalType}
                    onSave={handleSolicitudSaved}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default SolicitudesList;
