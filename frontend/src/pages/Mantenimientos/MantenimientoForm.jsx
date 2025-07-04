import React, { useState, useEffect } from 'react';
import { createMantenimiento, updateMantenimiento } from '../../services/mantenimientosService';
import { getEquipos } from '../../services/equiposService';
import Input from '../../components/Input';
import Button from '../../components/Button';

const tiposMantenimiento = [
  { value: 'preventivo', label: 'Preventivo' },
  { value: 'correctivo', label: 'Correctivo' },
  { value: 'predictivo', label: 'Predictivo' },
];

const estadosMantenimiento = [
  { value: 'programado', label: 'Programado' },
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'completado', label: 'Completado' },
  { value: 'cancelado', label: 'Cancelado' },
];

export default function MantenimientoForm({ initialValues = {}, onSuccess, onCancel }) {
  const [values, setValues] = useState({
    equipo_id: initialValues.equipo_id || '',
    tipo_mantenimiento: initialValues.tipo_mantenimiento || '',
    descripcion: initialValues.descripcion || '',
    fecha_mantenimiento: initialValues.fecha_mantenimiento || '',
    tecnico_id: initialValues.tecnico_id || '',
    costo: initialValues.costo || '',
    observaciones: initialValues.observaciones || '',
    estado: initialValues.estado || '',
  });
  const [equipos, setEquipos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEquipos().then(setEquipos);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (initialValues.id) {
        await updateMantenimiento(initialValues.id, values);
      } else {
        await createMantenimiento(values);
      }
      onSuccess();
    } catch (error) {
      setError('Error al guardar mantenimiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      <div>
        <label className="block font-bold mb-1">Equipo</label>
        <select name="equipo_id" value={values.equipo_id} onChange={handleChange} className="border rounded px-3 py-2 w-full" required>
          <option value="">Seleccione un equipo</option>
          {equipos.map(e => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-bold mb-1">Tipo de Mantenimiento</label>
        <select name="tipo_mantenimiento" value={values.tipo_mantenimiento} onChange={handleChange} className="border rounded px-3 py-2 w-full" required>
          <option value="">Seleccione un tipo</option>
          {tiposMantenimiento.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <Input name="descripcion" label="Descripción" value={values.descripcion} onChange={handleChange} required />
      <Input name="fecha_mantenimiento" label="Fecha de Mantenimiento" type="date" value={values.fecha_mantenimiento} onChange={handleChange} required />
      <Input name="costo" label="Costo" type="number" step="0.01" value={values.costo} onChange={handleChange} />
      <Input name="observaciones" label="Observaciones" value={values.observaciones} onChange={handleChange} />
      <div>
        <label className="block font-bold mb-1">Técnico Responsable</label>
        <select name="tecnico_id" value={values.tecnico_id} onChange={handleChange} className="border rounded px-3 py-2 w-full">
          <option value="">Seleccione un técnico</option>
          {equipos.map(e => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-bold mb-1">Estado</label>
        <select name="estado" value={values.estado} onChange={handleChange} className="border rounded px-3 py-2 w-full" required>
          <option value="">Seleccione un estado</option>
          {estadosMantenimiento.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" onClick={onCancel} className="bg-gray-200 text-primary hover:bg-gray-300">Cancelar</Button>
        <Button type="submit" loading={loading}>Guardar</Button>
      </div>
    </form>
  );
} 