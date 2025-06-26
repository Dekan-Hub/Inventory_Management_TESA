import React, { useState, useEffect } from 'react';

/**
 * UsuarioForm: Componente para el formulario de creación o edición de usuarios.
 * @param {object} props - Propiedades del componente.
 * @param {object} [props.userToEdit=null] - Objeto de usuario si se está editando, null para crear.
 * @param {function} props.onBackToList - Función para volver a la vista de lista.
 * @param {function} props.onSaveUser - Función para guardar (crear/actualizar) el usuario en el backend.
 */
const UsuarioForm = ({ userToEdit, onBackToList, onSaveUser }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    nombre: '',
    correo: '',
    rol: 'usuario', // Valor por defecto
    contraseña: ''
  });
  const [errors, setErrors] = useState({});
  const [isNewUser, setIsNewUser] = useState(!userToEdit);

  useEffect(() => {
    // Si hay un usuario para editar, precarga los datos del formulario
    if (userToEdit) {
      setFormData({
        id: userToEdit.id || userToEdit._id, // Usar id o _id según tu backend
        usuario: userToEdit.usuario || '',
        nombre: userToEdit.nombre || '',
        correo: userToEdit.correo || '',
        rol: userToEdit.rol || 'usuario',
        contraseña: '' // La contraseña no se precarga por seguridad, siempre se ingresa nueva o se deja vacía
      });
      setIsNewUser(false);
    } else {
      // Si no hay usuario para editar, reinicia el formulario
      setFormData({
        usuario: '',
        nombre: '',
        correo: '',
        rol: 'usuario',
        contraseña: ''
      });
      setIsNewUser(true);
    }
    setErrors({}); // Limpia errores al cambiar de usuario/modo
  }, [userToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.usuario.trim()) newErrors.usuario = 'El nombre de usuario es requerido.';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre completo es requerido.';
    if (!formData.correo.trim()) newErrors.correo = 'El correo electrónico es requerido.';
    else if (!/\S+@\S+\.\S+/.test(formData.correo)) newErrors.correo = 'El correo electrónico no es válido.';

    // La contraseña es requerida solo para nuevos usuarios
    // Para edición, es opcional (si se deja vacío, no se cambia en el backend)
    if (isNewUser && !formData.contraseña) {
      newErrors.contraseña = 'La contraseña es requerida para nuevos usuarios.';
    } else if (formData.contraseña && formData.contraseña.length < 6) {
      newErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Preparamos los datos a enviar. Si la contraseña está vacía en edición, no la enviamos.
      const dataToSend = { ...formData };
      if (!isNewUser && dataToSend.contraseña === '') {
        delete dataToSend.contraseña; // No enviar la contraseña si no se ha modificado en edición
      }

      console.log('Formulario de usuario enviado:', dataToSend);
      onSaveUser(dataToSend); // Llamar a la función onSaveUser con los datos ajustados
    } else {
      console.log('Errores en el formulario:', errors);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mt-4">
      <h4 className="text-xl font-medium text-tesa-text mb-4">{isNewUser ? 'Añadir Nuevo Usuario' : 'Editar Usuario'}</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">Usuario</label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tesa-accent focus:ring-tesa-accent"
            required
          />
          {errors.usuario && <p className="mt-1 text-sm text-red-600">{errors.usuario}</p>}
        </div>
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tesa-accent focus:ring-tesa-accent"
            required
          />
          {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
        </div>
        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tesa-accent focus:ring-tesa-accent"
            required
          />
          {errors.correo && <p className="mt-1 text-sm text-red-600">{errors.correo}</p>}
        </div>
        <div>
          <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol</label>
          <select
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tesa-accent focus:ring-tesa-accent"
          >
            <option value="administrador">Administrador</option>
            <option value="técnico">Técnico</option>
            <option value="usuario">Usuario</option>
          </select>
        </div>
        <div>
          {/* ¡CAMBIADO: name='contraseña' y ya no hay confirmPassword! */}
          <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700">Contraseña {isNewUser ? '' : '(dejar vacío para no cambiar)'}</label>
          <input
            type="password"
            id="contraseña"
            name="contraseña" // Nombre del campo para el backend
            value={formData.contraseña}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tesa-accent focus:ring-tesa-accent"
            // La contraseña solo es requerida para nuevos usuarios
            {...(isNewUser ? { required: true } : {})}
          />
          {errors.contraseña && <p className="mt-1 text-sm text-red-600">{errors.contraseña}</p>}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onBackToList}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-tesa-accent text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-colors duration-200"
          >
            {isNewUser ? 'Crear Usuario' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;
