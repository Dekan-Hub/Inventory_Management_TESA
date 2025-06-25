// Importa React y hooks esenciales como useState, useEffect, useCallback, useContext.
import React, { useState, useEffect, useCallback, useContext } from 'react';
// Importa las funciones de servicio para interactuar con la API de equipos.
import { getEquipos, deleteEquipo } from '../../services/equiposService';
// Importa el formulario de equipos y los componentes genéricos.
import EquipoForm from './EquipoForm';
import Modal from '../../components/Modal'; // Usamos el Modal genérico
import Button from '../../components/Button';
import Header from '../../components/Header';
import Table from '../../components/Table';
import Loader from '../../components/Loader';
import { AuthContext } from '../../context/AuthContext'; // Para setGlobalMessage

/**
 * EquiposList: Componente de la página de gestión de equipos.
 * Muestra una tabla con la lista de equipos y permite agregar, editar y eliminar equipos.
 */
const EquiposList = () => {
    // Estado para almacenar la lista de equipos.
    const [equipos, setEquipos] = useState([]);
    // Estado para controlar el estado de carga (mientras se obtienen o manipulan los equipos).
    const [isLoading, setIsLoading] = useState(true);
    // Estado para controlar la visibilidad del modal de formulario (agregar/editar).
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para almacenar los datos del equipo actual que se está agregando o editando.
    const [currentEquipo, setCurrentEquipo] = useState(null);
    // Estado para indicar el tipo de operación en el modal de formulario ('add' o 'edit').
    const [modalType, setModalType] = useState('add');
    // Estado para almacenar el ID del equipo a eliminar, utilizado en el modal de confirmación.
    const [equipoIdToDelete, setEquipoIdToDelete] = useState(null);
    // Acceso al sistema de mensajes globales del AuthContext.
    const { setGlobalMessage } = useContext(AuthContext);

    /**
     * `fetchEquipos`: Función para obtener la lista de equipos desde el backend.
     * Utiliza `useCallback` para memorizar la función.
     */
    const fetchEquipos = useCallback(async () => {
        setIsLoading(true); // Activa el estado de carga.
        try {
            const data = await getEquipos(); // Llama al servicio para obtener equipos.
            setEquipos(data); // Actualiza el estado con los equipos.
        } catch (err) {
            console.error('Error fetching equipos:', err);
            setGlobalMessage({ message: `Error al cargar equipos: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false); // Desactiva el estado de carga.
        }
    }, [setGlobalMessage]); // Dependencias: setGlobalMessage para que se actualice si cambia (aunque es estable).

    // `useEffect` para cargar los equipos cuando el componente se monta.
    useEffect(() => {
        fetchEquipos();
    }, [fetchEquipos]); // Se re-ejecuta si `fetchEquipos` cambia.

    /**
     * `handleAddEquipo`: Prepara el modal para agregar un nuevo equipo.
     */
    const handleAddEquipo = () => {
        // Inicializa un equipo vacío para el formulario.
        setCurrentEquipo({ nombre: '', categoria: '', stock: 0, precio: 0, estado: 'Disponible' });
        setModalType('add'); // Establece el tipo de modal como 'add'.
        setIsModalOpen(true); // Abre el modal.
    };

    /**
     * `handleEditEquipo`: Prepara el modal para editar un equipo existente.
     * @param {object} equipo - El objeto equipo a editar.
     */
    const handleEditEquipo = (equipo) => {
        // Clona el objeto equipo para evitar mutaciones directas del estado.
        setCurrentEquipo({ ...equipo });
        setModalType('edit'); // Establece el tipo de modal como 'edit'.
        setIsModalOpen(true); // Abre el modal.
    };

    /**
     * `handleDeleteEquipo`: Prepara el modal de confirmación para eliminar un equipo.
     * @param {string} id - El ID del equipo a eliminar.
     */
    const handleDeleteEquipo = (id) => {
        setEquipoIdToDelete(id); // Guarda el ID del equipo a eliminar.
        setGlobalMessage({
            message: `¿Estás seguro de que quieres eliminar este equipo (ID: ${id.substring(0, 8)}...)?`,
            type: 'confirm',
            onConfirm: confirmDelete // Pasa la función de confirmación.
        });
    };

    /**
     * `confirmDelete`: Ejecuta la eliminación del equipo después de la confirmación del usuario.
     */
    const confirmDelete = async () => {
        if (!equipoIdToDelete) return; // Si no hay ID, no hace nada.

        setGlobalMessage({ message: '', type: '', onConfirm: null }); // Limpia el mensaje de confirmación.
        setIsLoading(true); // Activa el estado de carga.
        try {
            await deleteEquipo(equipoIdToDelete); // Llama al servicio para eliminar el equipo.
            setGlobalMessage({ message: 'Equipo eliminado exitosamente.', type: 'success' });
            fetchEquipos(); // Recarga la lista de equipos para reflejar el cambio.
        } catch (err) {
            console.error('Error deleting equipo:', err);
            setGlobalMessage({ message: `Error al eliminar equipo: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false); // Desactiva el estado de carga.
            setEquipoIdToDelete(null); // Limpia el ID del equipo a eliminar.
        }
    };

    /**
     * `handleEquipoSaved`: Función de callback que se llama cuando el formulario del modal guarda un equipo.
     * @param {boolean} success - Indica si la operación de guardado fue exitosa.
     * @param {string} msg - El mensaje de la operación.
     */
    const handleEquipoSaved = (success, msg) => {
        setIsModalOpen(false); // Cierra el modal de formulario.
        setGlobalMessage({ message: msg, type: success ? 'success' : 'error' });
        if (success) {
            fetchEquipos(); // Recarga la lista de equipos.
        }
    };

    // Define las columnas para el componente Table.
    const columns = [
        { header: 'ID', accessor: '_id', render: (row) => row._id.substring(0, 8) + '...' },
        { header: 'Equipo', accessor: 'nombre' },
        { header: 'Categoría', accessor: 'categoria' },
        { header: 'Stock', accessor: 'stock' },
        { header: 'Precio', accessor: 'precio', render: (row) => `$${row.precio?.toFixed(2) || '0.00'}` },
        {
            header: 'Estado',
            accessor: 'estado',
            render: (row) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    row.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                    row.estado === 'Bajo Stock' ? 'bg-yellow-100 text-yellow-800' :
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
                    <Button onClick={() => handleEditEquipo(row)} className="p-1" variant="secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" />
                        </svg>
                    </Button>
                    <Button onClick={() => handleDeleteEquipo(row._id)} className="p-1" variant="danger">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                        </svg>
                    </Button>
                </div>
            ),
        },
    ];

    // Muestra un mensaje de carga si los datos están siendo obtenidos.
    if (isLoading) return <Loader fullScreen message="Cargando equipos..." />;

    return (
        <div className="p-6 bg-gray-100 flex-1 overflow-y-auto rounded-lg font-inter">
            <Header
                title="Gestión de Equipos"
                subtitle="Administra el inventario de equipos tecnológicos de la empresa."
            >
                <Button onClick={handleAddEquipo} variant="primary" className="px-5 py-2">
                    + Nuevo Equipo
                </Button>
            </Header>

            <Card>
                <Table
                    columns={columns}
                    data={equipos}
                    emptyMessage="No hay equipos disponibles."
                />
            </Card>

            {/* Modal para Agregar/Editar Equipo. */}
            {/* Se renderiza condicionalmente si `isModalOpen` es true. */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalType === 'add' ? 'Agregar Nuevo Equipo' : 'Editar Equipo'}
            >
                <EquipoForm
                    equipo={currentEquipo}
                    modalType={modalType} // Pasa el tipo de operación.
                    onSave={handleEquipoSaved} // Callback cuando el formulario guarda el equipo.
                    onCancel={() => setIsModalOpen(false)} // Función para cancelar y cerrar el modal.
                />
            </Modal>
        </div>
    );
};

export default EquiposList;
