import React, { useState } from 'react';
import Card from '../../components/Card.jsx';
import Form from '../../components/Form.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import solicitudesService from '../../services/solicitudesService.js';

/**
 * SolicitudForm: Componente de formulario para crear una nueva solicitud de equipo.
 */
const SolicitudForm = () => {
  const [formData, setFormData] = useState({
    usuario_id: '',
    equipo_id: '',
    motivo: '',
    estado: 'Pendiente', // Estado inicial por defecto
    fecha_solicitud: new Date().toISOString().split('T')[0], // Fecha actual
    admin_id: '', // Podría ser nulo inicialmente
    fecha_respuesta: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      await solicitudesService.create(formData);
      setMessage('Solicitud enviada exitosamente.');
      setFormData({ // Limpia el formulario
        usuario_id: '', equipo_id: '', motivo: '', estado: 'Pendiente',
        fecha_solicitud: new Date().toISOString().split('T')[0], admin_id: '', fecha_respuesta: ''
      });
    } catch (err) {
      setMessage('Error al enviar solicitud: ' + err.message);
      setIsError(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Formulario de Solicitud</h3>
      <Form onSubmit={handleSubmit}>
        <Input label="ID Usuario Solicitante" id="usuario_id" value={formData.usuario_id} onChange={handleChange} required />
        <Input label="ID Equipo (si aplica)" id="equipo_id" value={formData.equipo_id} onChange={handleChange} />
        <Input label="Motivo de Solicitud" id="motivo" value={formData.motivo} onChange={handleChange} required />
        {/* El estado y fechas de respuesta/admin_id pueden ser gestionados por el admin */}
        <Input label="Fecha de Solicitud" id="fecha_solicitud" type="date" value={formData.fecha_solicitud} onChange={handleChange} disabled />

        {message && (
          <p className={`text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar Solicitud'}
        </Button>
      </Form>
    </Card>
  );
};

export default SolicitudForm;
