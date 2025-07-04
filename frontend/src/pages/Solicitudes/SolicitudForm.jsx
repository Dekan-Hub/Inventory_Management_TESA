import React, { useState, useEffect } from 'react';
import { createSolicitud, updateSolicitud } from '../../services/solicitudesService';
import { getEquipos } from '../../services/equiposService';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AdjuntosList from '../../components/AdjuntosList';

const tiposSolicitud = [
  { value: 'nuevo_equipo', label: 'Nuevo Equipo' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'movimiento', label: 'Movimiento' },
  { value: 'otro', label: 'Otro' },
];

const estadosSolicitud = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'aprobada', label: 'Aprobada' },
  { value: 'rechazada', label: 'Rechazada' },
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'completada', label: 'Completada' },
];

export default function SolicitudForm({ initialValues = {}, onSuccess, onCancel }) {
  const { user } = useAuth();
  const [values, setValues] = useState({
    tipo_solicitud: initialValues.tipo_solicitud || '',
    titulo: initialValues.titulo || '',
    descripcion: initialValues.descripcion || '',
    equipo_id: initialValues.equipo_id || '',
    estado: initialValues.estado || 'pendiente',
  });
  const [equipos, setEquipos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEquipos().then(setEquipos);
  }, []);

  // Actualizar valores cuando cambien los initialValues (para edición)
  useEffect(() => {
    if (initialValues.id) {
      setValues({
        tipo_solicitud: initialValues.tipo_solicitud || '',
        titulo: initialValues.titulo || '',
        descripcion: initialValues.descripcion || '',
        equipo_id: initialValues.equipo_id || '',
        estado: initialValues.estado || 'pendiente',
      });
    }
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
        await updateSolicitud(initialValues.id, values);
      } else {
        await createSolicitud(values);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar solicitud:', error);
      setError(error.response?.data?.message || 'Error al guardar solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        
        <div>
          <label className="block font-bold mb-1">Tipo de Solicitud *</label>
          <select 
            name="tipo_solicitud" 
            value={values.tipo_solicitud} 
            onChange={handleChange} 
            className="border rounded px-3 py-2 w-full" 
            required
          >
            <option value="">Seleccione un tipo</option>
            {tiposSolicitud.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        
        <Input 
          name="titulo" 
          label="Título *" 
          value={values.titulo} 
          onChange={handleChange} 
          required 
          placeholder="Ej: Solicitud de mantenimiento preventivo"
        />
        
        <div>
          <label className="block font-bold mb-1">Descripción *</label>
          <textarea 
            name="descripcion" 
            value={values.descripcion} 
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full h-24 resize-none"
            placeholder="Describe detalladamente tu solicitud..."
            required
          />
        </div>
        
        <div>
          <label className="block font-bold mb-1">Equipo (opcional)</label>
          <select 
            name="equipo_id" 
            value={values.equipo_id} 
            onChange={handleChange} 
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Sin equipo asociado</option>
            {equipos.map(e => (
              <option key={e.id} value={e.id}>{e.nombre} - {e.numero_serie}</option>
            ))}
          </select>
        </div>
        
              {user?.rol === 'administrador' && (
        <div>
          <label className="block font-bold mb-1">Estado</label>
          <select 
            name="estado" 
            value={values.estado} 
            onChange={handleChange} 
            className="border rounded px-3 py-2 w-full"
          >
            {estadosSolicitud.map(e => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>
      )}
        
        <div className="flex gap-2 justify-end">
          <Button 
            type="button" 
            onClick={onCancel} 
            className="bg-gray-200 text-primary hover:bg-gray-300"
          >
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {initialValues.id ? 'Actualizar' : 'Crear'} Solicitud
          </Button>
        </div>
      </form>

      {/* Sección de adjuntos (solo mostrar si es edición) */}
      {initialValues.id && (
        <div className="mt-8 pt-6 border-t">
          <AdjuntosList 
            solicitudId={initialValues.id} 
            onAdjuntoChange={() => {
              // Callback opcional para notificar cambios
            }}
          />
        </div>
      )}
    </div>
  );
} 