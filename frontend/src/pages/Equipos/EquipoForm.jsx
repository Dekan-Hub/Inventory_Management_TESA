import React, { useState, useEffect } from 'react';
import { createEquipo, updateEquipo } from '../../services/equiposService';
import { getTiposEquipo } from '../../services/tipoEquipoService';
import { getEstadosEquipo } from '../../services/estadoEquipoService';
import { getUbicaciones } from '../../services/ubicacionesService';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function EquipoForm({ initialValues = {}, onSuccess, onCancel }) {
  const [values, setValues] = useState({
    nombre: initialValues.nombre || '',
    numero_serie: initialValues.numero_serie || '',
    modelo: initialValues.modelo || '',
    marca: initialValues.marca || '',
    observaciones: initialValues.observaciones || '',
    fecha_adquisicion: initialValues.fecha_adquisicion || '',
    tipo_equipo_id: initialValues.tipo_equipo_id?.toString() || '',
    estado_id: initialValues.estado_id?.toString() || '',
    ubicacion_id: initialValues.ubicacion_id?.toString() || '',
    usuario_asignado_id: initialValues.usuario_asignado_id?.toString() || '',
  });
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [tiposData, estadosData, ubicacionesData] = await Promise.all([
          getTiposEquipo(),
          getEstadosEquipo(),
          getUbicaciones()
        ]);
        setTipos(tiposData);
        setEstados(estadosData);
        setUbicaciones(ubicacionesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos necesarios');
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  // Actualizar valores cuando cambien los initialValues
  useEffect(() => {
    setValues({
      nombre: initialValues.nombre || '',
      numero_serie: initialValues.numero_serie || '',
      modelo: initialValues.modelo || '',
      marca: initialValues.marca || '',
      observaciones: initialValues.observaciones || '',
      fecha_adquisicion: initialValues.fecha_adquisicion || '',
      tipo_equipo_id: initialValues.tipo_equipo_id?.toString() || '',
      estado_id: initialValues.estado_id?.toString() || '',
      ubicacion_id: initialValues.ubicacion_id?.toString() || '',
      usuario_asignado_id: initialValues.usuario_asignado_id?.toString() || '',
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
        await updateEquipo(initialValues.id, values);
      } else {
        await createEquipo(values);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar equipo:', error);
      setError(error.response?.data?.message || 'Error al guardar equipo');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className="text-center py-4">Cargando datos...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      <Input name="nombre" label="Nombre" value={values.nombre} onChange={handleChange} required />
      <Input name="numero_serie" label="Número de Serie" value={values.numero_serie} onChange={handleChange} required />
      <Input name="modelo" label="Modelo" value={values.modelo} onChange={handleChange} required />
      <Input name="marca" label="Marca" value={values.marca} onChange={handleChange} required />
      <Input name="observaciones" label="Observaciones" value={values.observaciones} onChange={handleChange} />
      <Input name="fecha_adquisicion" label="Fecha de Adquisición" type="date" value={values.fecha_adquisicion} onChange={handleChange} required />
      <div>
        <label className="block font-bold mb-1">Tipo de Equipo</label>
        <select name="tipo_equipo_id" value={values.tipo_equipo_id} onChange={handleChange} className="border rounded px-3 py-2 w-full" required>
          <option value="">Seleccione un tipo</option>
          {tipos.map(t => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-bold mb-1">Estado</label>
        <select name="estado_id" value={values.estado_id} onChange={handleChange} className="border rounded px-3 py-2 w-full" required>
          <option value="">Seleccione un estado</option>
          {estados.map(e => (
            <option key={e.id} value={e.id}>{e.estado}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-bold mb-1">Ubicación</label>
        <select name="ubicacion_id" value={values.ubicacion_id} onChange={handleChange} className="border rounded px-3 py-2 w-full" required>
          <option value="">Seleccione una ubicación</option>
          {ubicaciones.map(u => (
            <option key={u.id} value={u.id}>{u.edificio} - {u.sala}</option>
          ))}
        </select>
      </div>
      <Input name="usuario_asignado_id" label="ID Usuario Asignado" type="number" value={values.usuario_asignado_id} onChange={handleChange} />
      <div className="flex gap-2 justify-end">
        <Button type="button" onClick={onCancel} className="bg-gray-200 text-primary hover:bg-gray-300">Cancelar</Button>
        <Button type="submit" loading={loading}>Guardar</Button>
      </div>
    </form>
  );
} 