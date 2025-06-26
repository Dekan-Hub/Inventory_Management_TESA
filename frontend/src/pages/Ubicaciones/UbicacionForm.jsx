import React, { useState } from 'react';
import Card from '../../components/Card.jsx';
import Form from '../../components/Form.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import ubicacionesService from '../../services/ubicacionesService.js';

/**
 * UbicacionForm: Componente de formulario para registrar o editar una ubicación.
 */
const UbicacionForm = () => {
  const [formData, setFormData] = useState({
    edificio: '',
    sala: '',
    descripcion: '',
    tecnico_id: '',
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
      await ubicacionesService.create(formData);
      setMessage('Ubicación registrada exitosamente.');
      setFormData({ // Limpia el formulario
        edificio: '', sala: '', descripcion: '', tecnico_id: ''
      });
    } catch (err) {
      setMessage('Error al registrar ubicación: ' + err.message);
      setIsError(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Formulario de Ubicación</h3>
      <Form onSubmit={handleSubmit}>
        <Input label="Edificio" id="edificio" value={formData.edificio} onChange={handleChange} required />
        <Input label="Sala" id="sala" value={formData.sala} onChange={handleChange} required />
        <Input label="Descripción" id="descripcion" value={formData.descripcion} onChange={handleChange} />
        <Input label="ID Técnico Responsable" id="tecnico_id" value={formData.tecnico_id} onChange={handleChange} />

        {message && (
          <p className={`text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Ubicación'}
        </Button>
      </Form>
    </Card>
  );
};

export default UbicacionForm;
