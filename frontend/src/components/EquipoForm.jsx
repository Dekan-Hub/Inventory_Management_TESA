import React, { useState } from 'react';

export default function EquipoForm({ initialValues = {}, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    nombre: initialValues.nombre || '',
    tipo: initialValues.tipo || '',
    estado: initialValues.estado || '',
    ubicacion: initialValues.ubicacion || '',
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!values.nombre) {
      setError('El nombre es obligatorio');
      return;
    }
    setError('');
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      <div>
        <label className="block font-bold">Nombre</label>
        <input name="nombre" value={values.nombre} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
      </div>
      <div>
        <label className="block font-bold">Tipo</label>
        <input name="tipo" value={values.tipo} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
      </div>
      <div>
        <label className="block font-bold">Estado</label>
        <input name="estado" value={values.estado} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
      </div>
      <div>
        <label className="block font-bold">Ubicación</label>
        <input name="ubicacion" value={values.ubicacion} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-200">Cancelar</button>
        <button type="submit" className="px-4 py-2 rounded bg-primary text-white font-bold">Guardar</button>
      </div>
    </form>
  );
} 