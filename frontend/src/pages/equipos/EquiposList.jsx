import React, { useState, useEffect } from 'react';
import Table from '../../components/Table.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import Loader from '../../components/Loader.jsx';
import equiposService from '../../services/equiposService.js';

/**
 * EquiposList: Componente para mostrar una lista de equipos en una tabla.
 * Carga los datos de equipos desde el backend y permite acciones CRUD.
 */
const EquiposList = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para cargar los equipos
  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const data = await equiposService.getAll();
      setEquipment(data);
    } catch (err) {
      setError('Error al cargar equipos: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment(); // Carga los equipos al montar el componente
  }, []);

  // Headers para la tabla
  const headers = ['ID', 'Nombre', 'Marca', 'Modelo', 'Número de Serie', 'Acciones'];

  // Función para renderizar cada fila de la tabla
  const renderRow = (item) => (
    <tr key={item.id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.nombre}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.marca}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.modelo}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.numero_serie}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Button className="text-indigo-600 hover:text-indigo-900 mr-4 bg-transparent shadow-none" onClick={() => console.log('Editar', item.id)}>
          Editar
        </Button>
        <Button className="text-red-600 hover:text-red-900 bg-transparent shadow-none" onClick={() => console.log('Eliminar', item.id)}>
          Eliminar
        </Button>
      </td>
    </tr>
  );

  if (loading) return <Loader message="Cargando equipos..." className="mt-8" />;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Lista de Equipos</h3>
      <Table headers={headers} data={equipment} renderRow={renderRow} />
    </Card>
  );
};

export default EquiposList;
