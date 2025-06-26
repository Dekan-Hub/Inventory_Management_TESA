import React, { useState, useEffect, useCallback } from 'react';
import UsuarioList from './UsuarioList.jsx';
import UsuarioForm from './UsuarioForm.jsx';
import { useAuth } from '../../context/AuthContext.jsx'; // Necesario para obtener el token

/**
 * UsuariosIndex: Componente principal para la gestión de usuarios.
 * Maneja el estado de los usuarios y las interacciones con la API del backend.
 */
const UsuariosIndex = () => {
  const { user } = useAuth(); // Obtener el usuario autenticado (para su token)
  const [users, setUsers] = useState([]); // Estado para almacenar la lista de usuarios
  const [loading, setLoading] = useState(true); // Estado para el indicador de carga
  const [error, setError] = useState(null); // Estado para manejar errores de API
  const [currentView, setCurrentView] = useState('list'); // 'list' o 'form'
  const [editingUser, setEditingUser] = useState(null); // Usuario a editar

  // URL base de tu API de usuarios
  const API_URL = 'http://localhost:3000/api/usuarios';

  // Función para obtener el token JWT del localStorage
  const getAuthToken = useCallback(() => {
    try {
      const storedData = localStorage.getItem('userSession');
      if (storedData) {
        const sessionData = JSON.parse(storedData);
        console.log("UsuariosIndex (getAuthToken): Token obtenido de localStorage (primeros 10 chars):", sessionData.token ? sessionData.token.substring(0, 10) + '...' : 'No hay token');
        return sessionData.token;
      }
    } catch (e) {
      console.error("UsuariosIndex (getAuthToken): Error al parsear token de localStorage:", e);
    }
    return null;
  }, []); // useCallback para memorizar la función

  /**
   * fetchUsers: Obtiene la lista de usuarios del backend.
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken(); // Obtener el token antes de la llamada
    
    if (!token) {
      setError("No autorizado: Token no encontrado. Por favor, inicia sesión o recarga la página.");
      setLoading(false);
      console.error("UsuariosIndex (fetchUsers): Token no disponible para la llamada API.");
      return;
    }

    try {
      console.log("UsuariosIndex (fetchUsers): Realizando GET a", API_URL);
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ¡Aquí se envía el token!
        },
      });

      if (response.status === 401 || response.status === 403) {
        setError("Acceso denegado o sesión expirada. Por favor, vuelve a iniciar sesión.");
        // Podrías añadir aquí una lógica para forzar el logout si el token es inválido
        console.error("UsuariosIndex (fetchUsers): Error de autorización/autenticación:", response.status);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar usuarios.');
      }

      const data = await response.json();
      setUsers(data.usuarios || []); // Asumiendo que el backend devuelve { usuarios: [...] }
      console.log("UsuariosIndex (fetchUsers): Usuarios cargados exitosamente:", data.usuarios);
    } catch (err) {
      console.error('UsuariosIndex (fetchUsers): Error al obtener usuarios:', err);
      setError(err.message || 'Error desconocido al cargar usuarios.');
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]); // Depende de getAuthToken

  // Cargar usuarios al montar el componente y cada vez que fetchUsers cambie
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /**
   * handleSaveUser: Maneja la creación o actualización de un usuario.
   * @param {object} userData - Datos del usuario a guardar.
   */
  const handleSaveUser = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    const token = getAuthToken();
    if (!token) {
      setError("No autorizado: Token no encontrado. Por favor, inicia sesión.");
      setLoading(false);
      return;
    }

    try {
      let response;
      if (userData.id) { // Si userData tiene un ID, es una actualización (PUT)
        console.log("UsuariosIndex (handleSaveUser): Enviando actualización de usuario:", userData);
        response = await fetch(`${API_URL}/${userData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userData),
        });
      } else { // Si no tiene ID, es una creación (POST)
        console.log("UsuariosIndex (handleSaveUser): Enviando nuevo usuario:", userData);
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al ${userData.id ? 'actualizar' : 'crear'} usuario.`);
      }

      await fetchUsers(); // Recargar la lista de usuarios
      setCurrentView('list'); // Volver a la vista de lista
      setEditingUser(null); // Limpiar usuario en edición
      console.log(`UsuariosIndex (handleSaveUser): Usuario ${userData.id ? 'actualizado' : 'creado'} exitosamente.`);
    } catch (err) {
      console.error(`UsuariosIndex (handleSaveUser): Error al ${userData.id ? 'actualizar' : 'crear'} usuario:`, err);
      setError(err.message || 'Error desconocido al guardar usuario.');
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, getAuthToken]); // Depende de fetchUsers y getAuthToken

  /**
   * handleDeleteUser: Maneja la eliminación de un usuario.
   * @param {string} userId - ID del usuario a eliminar.
   */
  const handleDeleteUser = useCallback(async (userId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción es irreversible.')) {
      return;
    }

    setLoading(true);
    setError(null);
    const token = getAuthToken();
    if (!token) {
      setError("No autorizado: Token no encontrado. Por favor, inicia sesión.");
      setLoading(false);
      return;
    }

    try {
      console.log("UsuariosIndex (handleDeleteUser): Enviando eliminación de usuario con ID:", userId);
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar usuario.');
      }

      await fetchUsers(); // Recargar la lista de usuarios
      console.log("UsuariosIndex (handleDeleteUser): Usuario eliminado exitosamente.");
    } catch (err) {
      console.error('UsuariosIndex (handleDeleteUser): Error al eliminar usuario:', err);
      setError(err.message || 'Error desconocido al eliminar usuario.');
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, getAuthToken]); // Depende de fetchUsers y getAuthToken

  /**
   * handleEditUser: Prepara el formulario para editar un usuario existente.
   * @param {object} user - El objeto de usuario a editar.
   */
  const handleEditUser = useCallback((user) => {
    setEditingUser(user);
    setCurrentView('form');
  }, []);

  /**
   * handleBackToList: Vuelve a la vista de lista desde el formulario.
   */
  const handleBackToList = useCallback(() => {
    setEditingUser(null);
    setCurrentView('list');
    setError(null); // Limpiar errores al volver a la lista
  }, []);

  // Renderizado condicional basado en el rol (redundante con el padre, pero buena práctica)
  if (user?.rol !== 'administrador') {
    return (
      <div className="p-6 bg-white rounded-xl shadow-inner border border-gray-200">
        <h4 className="text-2xl font-bold text-tesa-text mb-4">Acceso No Autorizado</h4>
        <p className="text-gray-600">Solo los administradores pueden gestionar usuarios.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-inner border border-gray-200">
      <h4 className="text-2xl font-bold text-tesa-text mb-4">Gestión de Usuarios del Sistema</h4>
      <p className="text-gray-600 mb-6">Administra los usuarios del sistema: roles, permisos y acceso.</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <p className="text-tesa-text">Cargando usuarios...</p>
          <svg className="animate-spin h-8 w-8 text-tesa-accent mx-auto mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {!loading && currentView === 'list' && (
        <>
          <button
            onClick={() => {
              setCurrentView('form');
              setEditingUser(null); // Asegura que el formulario esté en modo creación
            }}
            className="mb-4 px-6 py-2 bg-tesa-accent text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-colors duration-200"
          >
            Añadir Nuevo Usuario
          </button>
          <UsuarioList users={users} onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} />
        </>
      )}

      {!loading && currentView === 'form' && (
        <UsuarioForm
          userToEdit={editingUser}
          onBackToList={handleBackToList}
          onSaveUser={handleSaveUser}
        />
      )}
    </div>
  );
};

export default UsuariosIndex;
