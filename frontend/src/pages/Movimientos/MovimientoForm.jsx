import React, { useState, useEffect } from 'react';
import { createMovimiento, updateMovimiento } from '../../services/movimientosService';
import { getEquipos } from '../../services/equiposService';
import { getUbicaciones } from '../../services/ubicacionesService';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function MovimientoForm({ initialValues = {}, onSuccess, onCancel }) {
  const [values, setValues] = useState({
    equipo_id: initialValues.equipo_id || '',
    ubicacion_origen_id: initialValues.ubicacion_origen_id || '',
    ubicacion_destino_id: initialValues.ubicacion_destino_id || '',
    fecha_movimiento: initialValues.fecha_movimiento || '',
    motivo: initialValues.motivo || '',
    observaciones: initialValues.observaciones || '',
  });
  const [equipos, setEquipos] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEquipos().then(setEquipos);
    getUbicaciones().then(setUbicaciones);
  }, []);

  useEffect(() => {
    setValues({
      equipo_id: initialValues.equipo_id?.toString() || '',
      ubicacion_origen_id: initialValues.ubicacion_origen_id?.toString() || '',
      ubicacion_destino_id: initialValues.ubicacion_destino_id?.toString() || '',
      fecha_movimiento: initialValues.fecha_movimiento || '',
      motivo: initialValues.motivo || '',
      observaciones: initialValues.observaciones || '',
    });
  }, [initialValues]);

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
        await updateMovimiento(initialValues.id, values);
      } else {
        await createMovimiento(values);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar movimiento:', error);
      setError(error.response?.data?.message || 'Error al guardar movimiento');
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
        <label className="block font-bold mb-1">Ubicación Origen</label>
        <select name="ubicacion_origen_id" value={values.ubicacion_origen_id} onChange={handleChange} className="border rounded px-3 py-2 w-full" required>
          <option value="">Seleccione una ubicación</option>
          {ubicaciones.map(u => (
            <option key={u.id} value={u.id}>{u.edificio} - {u.sala}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-bold mb-1">Ubicación Destino</label>
        <select name="ubicacion_destino_id" value={values.ubicacion_destino_id} onChange={handleChange} className="border rounded px-3 py-2 w-full" required>
          <option value="">Seleccione una ubicación</option>
          {ubicaciones.map(u => (
            <option key={u.id} value={u.id}>{u.edificio} - {u.sala}</option>
          ))}
        </select>
      </div>
      <Input name="fecha_movimiento" label="Fecha de Movimiento" type="date" value={values.fecha_movimiento} onChange={handleChange} required />
      <Input name="motivo" label="Motivo del Movimiento" value={values.motivo} onChange={handleChange} required />
      <Input name="observaciones" label="Observaciones" value={values.observaciones} onChange={handleChange} />
      <div className="flex gap-2 justify-end">
        <Button type="button" onClick={onCancel} className="bg-gray-200 text-primary hover:bg-gray-300">Cancelar</Button>
        <Button type="submit" loading={loading}>Guardar</Button>
      </div>
    </form>
  );
} 