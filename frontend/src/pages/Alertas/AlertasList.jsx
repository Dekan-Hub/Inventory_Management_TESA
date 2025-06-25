import React, { useState, useEffect, useCallback, useContext } from 'react';
import { getAlertas, deleteAlerta, updateAlerta } from '../../services/alertasService';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Table from '../../components/Table';
import Loader from '../../components/Loader';
import { AuthContext } from '../../context/AuthContext';

/**
 * AlertasList: Componente de la página para listar y gestionar alertas y notificaciones del sistema.
 */
const AlertasList = () => {
    const [alertas, setAlertas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [alertaIdToDelete, setAlertaIdToDelete] = useState(null);
    const [alertaToView, setAlertaToView] = useState(null); // Para ver detalles en un modal
    const { setGlobalMessage } = useContext(AuthContext);

    const fetchAlertas = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAlertas();
            // Ordenar alertas: no leídas primero, luego por fecha descendente
            const sortedAlertas = data.sort((a, b) => {
                if (a.leida === b.leida) {
                    return new Date(b.fecha) - new Date(a.fecha);
                }
                return a.leida ? 1 : -1;
            });
            setAlertas(sortedAlertas);
        } catch (err) {
            console.error('Error fetching alertas:', err);
            setGlobalMessage({ message: `Error al cargar alertas: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [setGlobalMessage]);

    useEffect(() => {
        fetchAlertas();
    }, [fetchAlertas]);

    const handleMarkAsRead = async (id) => {
        setIsLoading(true);
        try {
            await updateAlerta(id, { leida: true });
            setGlobalMessage({ message: 'Alerta marcada como leída.', type: 'success' });
            fetchAlertas();
        } catch (err) {
            console.error('Error marking alert as read:', err);
            setGlobalMessage({ message: `Error al marcar alerta: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewAlerta = (alerta) => {
        setAlertaToView(alerta);
        if (!alerta.leida) {
            handleMarkAsRead(alerta._id); // Marcar como leída al ver
        }
    };

    const handleDeleteAlerta = (id) => {
        setAlertaIdToDelete(id);
        setGlobalMessage({
            message: `¿Estás seguro de que quieres eliminar esta alerta (ID: ${id.substring(0, 8)}...)?`,
            type: 'confirm',
            onConfirm: confirmDelete
        });
    };

    const confirmDelete = async () => {
        if (!alertaIdToDelete) return;

        setGlobalMessage({ message: '', type: '' });
        setIsLoading(true);
        try {
            await deleteAlerta(alertaIdToDelete);
            setGlobalMessage({ message: 'Alerta eliminada exitosamente.', type: 'success' });
            fetchAlertas();
        } catch (err) {
            console.error('Error deleting alerta:', err);
            setGlobalMessage({ message: `Error al eliminar alerta: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
            setAlertaIdToDelete(null);
        }
    };

    const columns = [
        { header: 'Tipo', accessor: 'tipo' },
        { header: 'Mensaje', accessor: 'mensaje' },
        { header: 'Fecha', accessor: 'fecha', render: (row) => new Date(row.fecha).toLocaleString() },
        {
            header: 'Leída',
            accessor: 'leida',
            render: (row) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    row.leida ? 'bg-gray-200 text-gray-800' : 'bg-blue-100 text-blue-800'
                }`}>
                    {row.leida ? 'Sí' : 'No'}
                </span>
            ),
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button onClick={() => handleViewAlerta(row)} className="p-1" variant="secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                    </Button>
                    {!row.leida && (
                        <Button onClick={() => handleMarkAsRead(row._id)} className="p-1" variant="primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </Button>
                    )}
                    <Button onClick={() => handleDeleteAlerta(row._id)} className="p-1" variant="danger">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                        </svg>
                    </Button>
                </div>
            ),
        },
    ];

    if (isLoading) return <Loader fullScreen message="Cargando alertas..." />;

    return (
        <div className="p-6 bg-gray-100 flex-1 overflow-y-auto rounded-lg font-inter">
            <Header
                title="Alertas y Notificaciones"
                subtitle="Visualiza las alertas generadas por el sistema."
            />

            <Card>
                <Table
                    columns={columns}
                    data={alertas}
                    emptyMessage="No hay alertas disponibles."
                />
            </Card>

            {alertaToView && (
                <Modal
                    isOpen={!!alertaToView}
                    onClose={() => setAlertaToView(null)}
                    title={`Detalles de la Alerta: ${alertaToView.tipo}`}
                    message={alertaToView.mensaje}
                    showCancelButton={false}
                    confirmText="Cerrar"
                >
                    <div className="text-gray-600 mt-4 text-sm">
                        <p><strong>Fecha:</strong> {new Date(alertaToView.fecha).toLocaleString()}</p>
                        <p><strong>Estado:</strong> {alertaToView.leida ? 'Leída' : 'No Leída'}</p>
                        {alertaToView.equipoId && <p><strong>ID Equipo:</strong> {alertaToView.equipoId}</p>}
                        {alertaToView.usuarioId && <p><strong>ID Usuario:</strong> {alertaToView.usuarioId}</p>}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AlertasList;
