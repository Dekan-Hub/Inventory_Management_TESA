import React, { useState, useEffect } from 'react';
import Table from '../../components/Table.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import Loader from '../../components/Loader.jsx';
import ubicacionesService from '../../services/ubicacionesService.js'; // Importa el servicio de ubicaciones

/**
 * UbicacionesList: Componente para mostrar una lista de ubicaciones en una tabla.
 * Carga los datos de ubicaciones desde el backend.
 */
const UbicacionesList = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para cargar las ubicaciones
  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await ubicacionesService.getAll(); // Llama a la API
      setLocations(data);
    } catch (err) {
      setError('Error al cargar ubicaciones: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const headers = ['ID', 'Edificio', 'Sala', 'Descripción', 'Técnico ID', 'Acciones'];

  const renderRow = (item) => (
    <tr key={item.id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.edificio}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sala}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.descripcion}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tecnico_id}</td>
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

  if (loading) return <Loader message="Cargando ubicaciones..." className="mt-8" />;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Lista de Ubicaciones</h3>
      <Table headers={headers} data={locations} renderRow={renderRow} />
    </Card>
  );
};

export default UbicacionesList;
