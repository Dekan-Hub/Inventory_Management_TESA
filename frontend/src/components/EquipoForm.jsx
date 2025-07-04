import React, { useState } from 'react';

export default function EquipoForm({ initialValues = {}, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    nombre: initialValues.nombre || '',
    numero_serie: initialValues.numero_serie || '',
    modelo: initialValues.modelo || '',
    marca: initialValues.marca || '',
    observaciones: initialValues.observaciones || '',
    fecha_adquisicion: initialValues.fecha_adquisicion || '',
    tipo_equipo_id: initialValues.tipo_equipo_id || '',
    estado_id: initialValues.estado_id || '',
    ubicacion_id: initialValues.ubicacion_id || '',
    usuario_asignado_id: initialValues.usuario_asignado_id || '',
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!values.nombre || !values.numero_serie) {
      setError('El nombre y número de serie son obligatorios');
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
        <input name="nombre" value={values.nombre} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
      </div>
      <div>
        <label className="block font-bold">Número de Serie</label>
        <input name="numero_serie" value={values.numero_serie} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
      </div>
      <div>
        <label className="block font-bold">Modelo</label>
        <input name="modelo" value={values.modelo} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
      </div>
      <div>
        <label className="block font-bold">Marca</label>
        <input name="marca" value={values.marca} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
      </div>
      <div>
        <label className="block font-bold">Observaciones</label>
        <textarea name="observaciones" value={values.observaciones} onChange={handleChange} className="border rounded px-3 py-2 w-full" rows="3" />
      </div>
      <div>
        <label className="block font-bold">Fecha de Adquisición</label>
        <input name="fecha_adquisicion" type="date" value={values.fecha_adquisicion} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
      </div>
      <div>
        <label className="block font-bold">Tipo de Equipo</label>
        <select name="tipo_equipo_id" value={values.tipo_equipo_id} onChange={handleChange} className="border rounded px-3 py-2 w-full" required>
          <option value="">Seleccione un tipo</option>
        </select>
      </div>
      <div>
        <label className="block font-bold">Estado</label>
        <select name="estado_id" value={values.estado_id} onChange={handleChange} className="border rounded px-3 py-2 w-full" required>
          <option value="">Seleccione un estado</option>
        </select>
      </div>
      <div>
        <label className="block font-bold">Ubicación</label>
        <select name="ubicacion_id" value={values.ubicacion_id} onChange={handleChange} className="border rounded px-3 py-2 w-full" required>
          <option value="">Seleccione una ubicación</option>
        </select>
      </div>
      <div>
        <label className="block font-bold">Usuario Asignado</label>
        <select name="usuario_asignado_id" value={values.usuario_asignado_id} onChange={handleChange} className="border rounded px-3 py-2 w-full">
          <option value="">Seleccione un usuario</option>
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-200">Cancelar</button>
        <button type="submit" className="px-4 py-2 rounded bg-primary text-white font-bold">Guardar</button>
      </div>
    </form>
  );
} 