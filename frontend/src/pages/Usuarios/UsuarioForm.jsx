import React, { useState } from 'react';
import { createUsuario, updateUsuario } from '../../services/usuariosService';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function UsuarioForm({ initialValues = {}, onSuccess, onCancel }) {
  const [values, setValues] = useState({
    nombre: initialValues.nombre || '',
    usuario: initialValues.usuario || '',
    correo: initialValues.correo || '',
    rol: initialValues.rol || '',
    contraseña: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (initialValues.id) {
        const data = { ...values };
        if (!data.contraseña) delete data.contraseña;
        await updateUsuario(initialValues.id, data);
      } else {
        await createUsuario(values);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      setError('Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      <Input name="nombre" label="Nombre" value={values.nombre} onChange={handleChange} required />
      <Input name="usuario" label="Usuario" value={values.usuario} onChange={handleChange} required />
      <Input name="correo" label="Correo" type="email" value={values.correo} onChange={handleChange} required />
      <div>
        <label className="block font-bold mb-1">Rol</label>
        <select name="rol" value={values.rol} onChange={handleChange} className="border rounded px-3 py-2 w-full" required>
          <option value="">Seleccione un rol</option>
          <option value="administrador">Administrador</option>
          <option value="tecnico">Técnico</option>
          <option value="usuario">Usuario</option>
        </select>
      </div>
      {!initialValues.id && (
        <Input name="contraseña" label="Contraseña" type="password" value={values.contraseña} onChange={handleChange} required />
      )}
      <div className="flex gap-2 justify-end">
        <Button type="button" onClick={onCancel} className="bg-gray-200 text-primary hover:bg-gray-300">Cancelar</Button>
        <Button type="submit" loading={loading}>Guardar</Button>
      </div>
    </form>
  );
} 