import React, { useState } from 'react';
import Card from '../../components/Card.jsx';
import Form from '../../components/Form.jsx';
import Input from '../../components/Input.jsx';
import Button from '../../components/Button.jsx';
import equiposService from '../../services/equiposService.js';

/**
 * EquipoForm: Componente de formulario para registrar o editar un equipo.
 */
const EquipoForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    modelo: '',
    numero_serie: '',
    tipo_equipo_id: '',
    estado_id: '',
    ubicacion_id: '',
    usuario_asignado_id: '',
    fecha_adquisicion: '',
    observaciones: '',
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
      await equiposService.create(formData);
      setMessage('Equipo registrado exitosamente.');
      setFormData({ // Limpia el formulario
        nombre: '', marca: '', modelo: '', numero_serie: '', tipo_equipo_id: '',
        estado_id: '', ubicacion_id: '', usuario_asignado_id: '', fecha_adquisicion: '', observaciones: ''
      });
    } catch (err) {
      setMessage('Error al registrar equipo: ' + err.message);
      setIsError(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Formulario de Equipo</h3>
      <Form onSubmit={handleSubmit}>
        <Input label="Nombre" id="nombre" value={formData.nombre} onChange={handleChange} required />
        <Input label="Marca" id="marca" value={formData.marca} onChange={handleChange} required />
        <Input label="Modelo" id="modelo" value={formData.modelo} onChange={handleChange} required />
        <Input label="Número de Serie" id="numero_serie" value={formData.numero_serie} onChange={handleChange} required />
        <Input label="ID Tipo de Equipo" id="tipo_equipo_id" value={formData.tipo_equipo_id} onChange={handleChange} />
        <Input label="ID Estado" id="estado_id" value={formData.estado_id} onChange={handleChange} />
        <Input label="ID Ubicación" id="ubicacion_id" value={formData.ubicacion_id} onChange={handleChange} />
        <Input label="ID Usuario Asignado" id="usuario_asignado_id" value={formData.usuario_asignado_id} onChange={handleChange} />
        <Input label="Fecha de Adquisición" id="fecha_adquisicion" type="date" value={formData.fecha_adquisicion} onChange={handleChange} />
        <Input label="Observaciones" id="observaciones" value={formData.observaciones} onChange={handleChange} />

        {message && (
          <p className={`text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Equipo'}
        </Button>
      </Form>
    </Card>
  );
};

export default EquipoForm;
