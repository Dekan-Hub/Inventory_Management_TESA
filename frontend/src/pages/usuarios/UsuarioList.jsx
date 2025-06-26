import React from 'react';

/**
 * UsuarioList: Componente para mostrar la lista de usuarios en una tabla.
 * @param {object} props - Propiedades del componente.
 * @param {Array<object>} props.users - Lista de usuarios obtenida del backend.
 * @param {function} props.onEditUser - Función para manejar la edición de un usuario.
 * @param {function} props.onDeleteUser - Función para manejar la eliminación de un usuario.
 */
const UsuarioList = ({ users, onEditUser, onDeleteUser }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 mt-4">
      <h4 className="text-xl font-medium text-tesa-text mb-2">Lista de Usuarios</h4>
      {users.length === 0 ? (
        <p className="text-gray-600">No hay usuarios registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id || user._id}> {/* Usa user.id o user._id según tu backend */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id || user._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.usuario}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.correo}</td> {/* Asumo 'correo' para email */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{user.rol}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEditUser(user)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id || user._id)} // Pasa el ID para eliminar
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsuarioList;
