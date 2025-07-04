import React, { useEffect, useState } from 'react';
import { getUsuarios, deleteUsuario } from '../../services/usuariosService';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import UsuarioForm from './UsuarioForm';
import Button from '../../components/Button';

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState({});
  const [error, setError] = useState('');

  const fetchUsuarios = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getUsuarios();
      setUsuarios(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar los usuarios.');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = (usuario) => {
    setUsuarioToDelete(usuario);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (usuarioToDelete) {
      try {
        await deleteUsuario(usuarioToDelete.id);
        setModalOpen(false);
        setUsuarioToDelete(null);
        fetchUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        setError('Error al eliminar el usuario.');
      }
    }
  };

  const handleAdd = () => {
    setFormInitialValues({});
    setFormOpen(true);
  };

  const handleEdit = (usuario) => {
    setFormInitialValues(usuario);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    fetchUsuarios();
  };

  const getRolColor = (rol) => {
    switch (rol) {
      case 'administrador': return 'bg-red-100 text-red-800';
      case 'tecnico': return 'bg-blue-100 text-blue-800';
      case 'usuario': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { 
      key: 'nombre', 
      label: 'Nombre',
      render: (usuario) => usuario.nombre || 'N/A'
    },
    { 
      key: 'correo', 
      label: 'Correo',
      render: (usuario) => usuario.correo || 'N/A'
    },
    { 
      key: 'rol', 
      label: 'Rol',
      render: (usuario) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRolColor(usuario.rol)}`}>
          {usuario.rol}
        </span>
      )
    },
    { 
      key: 'departamento', 
      label: 'Departamento',
      render: (usuario) => usuario.departamento || 'N/A'
    },
    { 
      key: 'telefono', 
      label: 'Teléfono',
      render: (usuario) => usuario.telefono || 'N/A'
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Gestión de Usuarios</h1>
        <Button onClick={handleAdd}>Nuevo Usuario</Button>
      </div>
      
      {loading && <Loader />}
      {error && <div className="text-red-600 mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      
      {!loading && usuarios.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No hay usuarios registrados</p>
        </div>
      )}
      
      {!loading && usuarios.length > 0 && (
        <Table 
          columns={columns} 
          data={usuarios} 
          loading={loading} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirmar eliminación">
        <p>¿Estás seguro de que deseas eliminar al usuario <b>{usuarioToDelete?.nombre}</b>?</p>
        <div className="flex gap-2 justify-end mt-6">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded bg-gray-200">Cancelar</button>
          <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-600 text-white font-bold">Eliminar</button>
        </div>
      </Modal>
      
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={formInitialValues.id ? 'Editar Usuario' : 'Nuevo Usuario'}>
        <UsuarioForm
          initialValues={formInitialValues}
          onSuccess={handleFormSuccess}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
    </>
  );
} 