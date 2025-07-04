import React, { useState } from 'react';
import { responderSolicitud } from '../../services/solicitudesService';
import Button from '../../components/Button';

const estadosSolicitud = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'aprobada', label: 'Aprobada' },
  { value: 'rechazada', label: 'Rechazada' },
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'completada', label: 'Completada' },
];

export default function ResponderSolicitudForm({ solicitud, onSuccess, onCancel }) {
  const [values, setValues] = useState({
    estado: solicitud.estado || 'pendiente',
    respuesta: solicitud.respuesta || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await responderSolicitud(solicitud.id, values);
      onSuccess();
    } catch (error) {
      console.error('Error al responder solicitud:', error);
      setError(error.response?.data?.message || 'Error al responder solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <div>
        <label className="block font-bold mb-1">Estado *</label>
        <select 
          name="estado" 
          value={values.estado} 
          onChange={handleChange} 
          className="border rounded px-3 py-2 w-full"
          required
        >
          {estadosSolicitud.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block font-bold mb-1">Respuesta</label>
        <textarea 
          name="respuesta" 
          value={values.respuesta} 
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full h-32 resize-none"
          placeholder="Escribe tu respuesta o comentarios sobre esta solicitud..."
        />
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button 
          type="button" 
          onClick={onCancel} 
          className="bg-gray-200 text-primary hover:bg-gray-300"
        >
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Responder Solicitud
        </Button>
      </div>
    </form>
  );
} 