import React, { useState, useEffect, useCallback, useContext } from 'react';
import { getUsuarios, deleteUsuario } from '../../services/usuariosService';
import UsuarioForm from './UsuarioForm';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Table from '../../components/Table';
import { AuthContext } from '../../context/AuthContext'; // Para setGlobalMessage

/**
 * UsuariosList: Componente de la página de gestión de usuarios.
 * Muestra una tabla con la lista de usuarios y permite agregar, editar y eliminar usuarios.
 */
const UsuariosList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState(null);
    const [modalType, setModalType] = useState('add'); // 'add' o 'edit'
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const { setGlobalMessage } = useContext(AuthContext); // Acceso al sistema de mensajes globales

    /**
     * `fetchUsuarios`: Función para obtener la lista de usuarios desde el backend.
     */
    const fetchUsuarios = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getUsuarios();
            setUsuarios(data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setGlobalMessage({ message: `Error al cargar usuarios: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [setGlobalMessage]);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    const handleAddUsuario = () => {
        setCurrentUsuario({ username: '', email: '', password: '', role: 'user' });
        setModalType('add');
        setIsModalOpen(true);
    };

    const handleEditUsuario = (usuario) => {
        setCurrentUsuario({ ...usuario });
        setModalType('edit');
        setIsModalOpen(true);
    };

    const handleDeleteUsuario = (id) => {
        setUserIdToDelete(id);
        setGlobalMessage({
            message: `¿Estás seguro de que quieres eliminar a este usuario (ID: ${id.substring(0, 8)}...)?`,
            type: 'confirm',
            onConfirm: confirmDelete
        });
    };

    const confirmDelete = async () => {
        if (!userIdToDelete) return;

        setGlobalMessage({ message: '', type: '' }); // Limpia el mensaje de confirmación
        setIsLoading(true);
        try {
            await deleteUsuario(userIdToDelete);
            setGlobalMessage({ message: 'Usuario eliminado exitosamente.', type: 'success' });
            fetchUsuarios(); // Recarga la lista
        } catch (err) {
            console.error('Error deleting user:', err);
            setGlobalMessage({ message: `Error al eliminar usuario: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
            setUserIdToDelete(null);
        }
    };

    const handleUsuarioSaved = (success, msg) => {
        setIsModalOpen(false); // Cierra el modal de formulario
        setGlobalMessage({ message: msg, type: success ? 'success' : 'error' });
        if (success) {
            fetchUsuarios(); // Recarga la lista si la operación fue exitosa
        }
    };

    const columns = [
        { header: 'ID', accessor: '_id', render: (row) => row._id.substring(0, 8) + '...' },
        { header: 'Nombre de Usuario', accessor: 'username' },
        { header: 'Email', accessor: 'email' },
        { header: 'Rol', accessor: 'role' },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button onClick={() => handleEditUsuario(row)} className="p-1" variant="secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" />
                        </svg>
                    </Button>
                    <Button onClick={() => handleDeleteUsuario(row._id)} className="p-1" variant="danger">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                        </svg>
                    </Button>
                </div>
            ),
        },
    ];

    if (isLoading) return <Loader fullScreen message="Cargando usuarios..." />;

    return (
        <div className="p-6 bg-gray-100 flex-1 overflow-y-auto rounded-lg font-inter">
            <Header
                title="Gestión de Usuarios"
                subtitle="Administra los usuarios que tienen acceso al sistema."
            >
                <Button onClick={handleAddUsuario} variant="primary" className="px-5 py-2">
                    + Nuevo Usuario
                </Button>
            </Header>

            <Card>
                <Table
                    columns={columns}
                    data={usuarios}
                    emptyMessage="No hay usuarios registrados."
                />
            </Card>

            {/* Modal para Agregar/Editar Usuario */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalType === 'add' ? 'Agregar Nuevo Usuario' : 'Editar Usuario'}
            >
                <UsuarioForm
                    usuario={currentUsuario}
                    modalType={modalType}
                    onSave={handleUsuarioSaved}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default UsuariosList;
