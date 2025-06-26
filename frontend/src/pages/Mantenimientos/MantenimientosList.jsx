import React, { useState, useEffect } from 'react';
import Table from '../../components/Table.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import Loader from '../../components/Loader.jsx';
import mantenimientosService from '../../services/mantenimientosService.js';

/**
 * MantenimientosList: Componente para mostrar una lista de mantenimientos en una tabla.
 * Carga los datos de mantenimientos desde el backend.
 */
const MantenimientosList = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para cargar los mantenimientos
  const fetchMaintenances = async () => {
    try {
      setLoading(true);
      const data = await mantenimientosService.getAll();
      setMaintenances(data);
    } catch (err) {
      setError('Error al cargar mantenimientos: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenances();
  }, []);

  const headers = ['ID', 'Equipo ID', 'Ubicación ID', 'Responsable ID', 'Fecha', 'Acciones'];

  const renderRow = (item) => (
    <tr key={item.id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.equipo_id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ubicacion_id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.responsable_id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.fecha}</td>
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

  if (loading) return <Loader message="Cargando mantenimientos..." className="mt-8" />;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Lista de Mantenimientos</h3>
      <Table headers={headers} data={maintenances} renderRow={renderRow} />
    </Card>
  );
};

export default MantenimientosList;
