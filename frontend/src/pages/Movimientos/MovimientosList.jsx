import React, { useState, useEffect, useCallback, useContext } from 'react';
import { getMovimientos, createMovimiento, deleteMovimiento } from '../../services/movimientosService';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Table from '../../components/Table';
import Loader from '../../components/Loader';
import Input from '../../components/Input';
import Form from '../../components/Form';
import { AuthContext } from '../../context/AuthContext';

/**
 * MovimientosList: Componente de la página para registrar y visualizar traslados de equipos.
 */
const MovimientosList = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ equipo: '', ubicacionOrigen: '', ubicacionDestino: '', fecha: new Date().toISOString().split('T')[0] });
    const [errors, setErrors] = useState({});
    const [movimientoIdToDelete, setMovimientoIdToDelete] = useState(null);
    const { setGlobalMessage } = useContext(AuthContext);

    const fetchMovimientos = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getMovimientos();
            setMovimientos(data);
        } catch (err) {
            console.error('Error fetching movimientos:', err);
            setGlobalMessage({ message: `Error al cargar movimientos: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [setGlobalMessage]);

    useEffect(() => {
        fetchMovimientos();
    }, [fetchMovimientos]);

    const handleAddMovimiento = () => {
        setFormData({ equipo: '', ubicacionOrigen: '', ubicacionDestino: '', fecha: new Date().toISOString().split('T')[0] });
        setErrors({});
        setIsModalOpen(true);
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.equipo) newErrors.equipo = 'El equipo es requerido.';
        if (!formData.ubicacionOrigen) newErrors.ubicacionOrigen = 'La ubicación de origen es requerida.';
        if (!formData.ubicacionDestino) newErrors.ubicacionDestino = 'La ubicación de destino es requerida.';
        if (!formData.fecha) newErrors.fecha = 'La fecha es requerida.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await createMovimiento(formData);
            setGlobalMessage({ message: 'Movimiento registrado exitosamente.', type: 'success' });
            fetchMovimientos();
            setIsModalOpen(false); // Cierra el modal después de guardar
        } catch (error) {
            console.error('Error saving movimiento:', error);
            const apiErrorMessage = error.response?.data?.message || error.message || 'Error desconocido';
            setGlobalMessage({ message: `Error al registrar movimiento: ${apiErrorMessage}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMovimiento = (id) => {
        setMovimientoIdToDelete(id);
        setGlobalMessage({
            message: `¿Estás seguro de que quieres eliminar este movimiento (ID: ${id.substring(0, 8)}...)?`,
            type: 'confirm',
            onConfirm: confirmDelete
        });
    };

    const confirmDelete = async () => {
        if (!movimientoIdToDelete) return;

        setGlobalMessage({ message: '', type: '' });
        setIsLoading(true);
        try {
            await deleteMovimiento(movimientoIdToDelete);
            setGlobalMessage({ message: 'Movimiento eliminado exitosamente.', type: 'success' });
            fetchMovimientos();
        } catch (err) {
            console.error('Error deleting movimiento:', err);
            setGlobalMessage({ message: `Error al eliminar movimiento: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
            setMovimientoIdToDelete(null);
        }
    };

    const columns = [
        { header: 'ID', accessor: '_id', render: (row) => row._id.substring(0, 8) + '...' },
        { header: 'Equipo', accessor: 'equipo' },
        { header: 'Origen', accessor: 'ubicacionOrigen' },
        { header: 'Destino', accessor: 'ubicacionDestino' },
        { header: 'Fecha', accessor: 'fecha', render: (row) => new Date(row.fecha).toLocaleDateString() },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button onClick={() => handleDeleteMovimiento(row._id)} className="p-1" variant="danger">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                        </svg>
                    </Button>
                </div>
            ),
        },
    ];

    if (isLoading) return <Loader fullScreen message="Cargando movimientos..." />;

    return (
        <div className="p-6 bg-gray-100 flex-1 overflow-y-auto rounded-lg font-inter">
            <Header
                title="Registro de Movimientos"
                subtitle="Registra y visualiza los traslados de equipos entre ubicaciones."
            >
                <Button onClick={handleAddMovimiento} variant="primary" className="px-5 py-2">
                    + Nuevo Movimiento
                </Button>
            </Header>

            <Card>
                <Table
                    columns={columns}
                    data={movimientos}
                    emptyMessage="No hay movimientos registrados."
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Registrar Nuevo Movimiento"
            >
                <Form onSubmit={handleSubmit} disabled={isLoading} className="shadow-none p-0">
                    <Input
                        label="Equipo"
                        id="equipo"
                        type="text"
                        value={formData.equipo}
                        onChange={handleChange}
                        error={errors.equipo}
                        required
                        disabled={isLoading}
                    />
                    <Input
                        label="Ubicación Origen"
                        id="ubicacionOrigen"
                        type="text"
                        value={formData.ubicacionOrigen}
                        onChange={handleChange}
                        error={errors.ubicacionOrigen}
                        required
                        disabled={isLoading}
                    />
                    <Input
                        label="Ubicación Destino"
                        id="ubicacionDestino"
                        type="text"
                        value={formData.ubicacionDestino}
                        onChange={handleChange}
                        error={errors.ubicacionDestino}
                        required
                        disabled={isLoading}
                    />
                    <Input
                        label="Fecha del Movimiento"
                        id="fecha"
                        type="date"
                        value={formData.fecha}
                        onChange={handleChange}
                        error={errors.fecha}
                        required
                        disabled={isLoading}
                    />
                    <div className="flex justify-end space-x-4 mt-8">
                        <Button onClick={() => setIsModalOpen(false)} disabled={isLoading} variant="secondary">
                            Cancelar
                        </Button>
                        <Button type="submit" isLoading={isLoading} variant="primary">
                            {isLoading ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default MovimientosList;
