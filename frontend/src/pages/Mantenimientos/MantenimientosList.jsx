import React, { useState, useEffect, useCallback, useContext } from 'react';
import { getMantenimientos, deleteMantenimiento } from '../../services/mantenimientosService';
import MantenimientoForm from './MantenimientoForm';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Table from '../../components/Table';
import Loader from '../../components/Loader';
import { AuthContext } from '../../context/AuthContext';

/**
 * MantenimientosList: Componente de la página para listar y gestionar mantenimientos.
 */
const MantenimientosList = () => {
    const [mantenimientos, setMantenimientos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMantenimiento, setCurrentMantenimiento] = useState(null);
    const [modalType, setModalType] = useState('add'); // 'add' o 'edit'
    const [mantenimientoIdToDelete, setMantenimientoIdToDelete] = useState(null);
    const { setGlobalMessage } = useContext(AuthContext);

    const fetchMantenimientos = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getMantenimientos();
            setMantenimientos(data);
        } catch (err) {
            console.error('Error fetching mantenimientos:', err);
            setGlobalMessage({ message: `Error al cargar mantenimientos: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [setGlobalMessage]);

    useEffect(() => {
        fetchMantenimientos();
    }, [fetchMantenimientos]);

    const handleAddMantenimiento = () => {
        setCurrentMantenimiento({ equipo: '', fecha: new Date().toISOString().split('T')[0], tipo: 'Preventivo', descripcion: '' });
        setModalType('add');
        setIsModalOpen(true);
    };

    const handleEditMantenimiento = (mantenimiento) => {
        // Formatear la fecha para el input type="date"
        setCurrentMantenimiento({
            ...mantenimiento,
            fecha: new Date(mantenimiento.fecha).toISOString().split('T')[0]
        });
        setModalType('edit');
        setIsModalOpen(true);
    };

    const handleDeleteMantenimiento = (id) => {
        setMantenimientoIdToDelete(id);
        setGlobalMessage({
            message: `¿Estás seguro de que quieres eliminar este mantenimiento (ID: ${id.substring(0, 8)}...)?`,
            type: 'confirm',
            onConfirm: confirmDelete
        });
    };

    const confirmDelete = async () => {
        if (!mantenimientoIdToDelete) return;

        setGlobalMessage({ message: '', type: '' });
        setIsLoading(true);
        try {
            await deleteMantenimiento(mantenimientoIdToDelete);
            setGlobalMessage({ message: 'Mantenimiento eliminado exitosamente.', type: 'success' });
            fetchMantenimientos();
        } catch (err) {
            console.error('Error deleting mantenimiento:', err);
            setGlobalMessage({ message: `Error al eliminar mantenimiento: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
            setMantenimientoIdToDelete(null);
        }
    };

    const handleMantenimientoSaved = (success, msg) => {
        setIsModalOpen(false);
        setGlobalMessage({ message: msg, type: success ? 'success' : 'error' });
        if (success) {
            fetchMantenimientos();
        }
    };

    const columns = [
        { header: 'ID', accessor: '_id', render: (row) => row._id.substring(0, 8) + '...' },
        { header: 'Equipo', accessor: 'equipo' },
        { header: 'Fecha', accessor: 'fecha', render: (row) => new Date(row.fecha).toLocaleDateString() },
        { header: 'Tipo', accessor: 'tipo' },
        { header: 'Descripción', accessor: 'descripcion' },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button onClick={() => handleEditMantenimiento(row)} className="p-1" variant="secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" />
                        </svg>
                    </Button>
                    <Button onClick={() => handleDeleteMantenimiento(row._id)} className="p-1" variant="danger">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                        </svg>
                    </Button>
                </div>
            ),
        },
    ];

    if (isLoading) return <Loader fullScreen message="Cargando mantenimientos..." />;

    return (
        <div className="p-6 bg-gray-100 flex-1 overflow-y-auto rounded-lg font-inter">
            <Header
                title="Gestión de Mantenimientos"
                subtitle="Registra y consulta el historial de mantenimientos de los equipos."
            >
                <Button onClick={handleAddMantenimiento} variant="primary" className="px-5 py-2">
                    + Nuevo Mantenimiento
                </Button>
            </Header>

            <Card>
                <Table
                    columns={columns}
                    data={mantenimientos}
                    emptyMessage="No hay mantenimientos registrados."
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalType === 'add' ? 'Registrar Nuevo Mantenimiento' : 'Editar Mantenimiento'}
            >
                <MantenimientoForm
                    mantenimiento={currentMantenimiento}
                    modalType={modalType}
                    onSave={handleMantenimientoSaved}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default MantenimientosList;
