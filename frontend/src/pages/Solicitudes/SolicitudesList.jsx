import React, { useState, useEffect } from 'react';
import Table from '../../components/Table.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import Loader from '../../components/Loader.jsx';
import solicitudesService from '../../services/solicitudesService.js';

/**
 * SolicitudesList: Componente para mostrar una lista de solicitudes en una tabla.
 * Carga los datos de solicitudes desde el backend.
 */
const SolicitudesList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para cargar las solicitudes
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await solicitudesService.getAll();
      setRequests(data);
    } catch (err) {
      setError('Error al cargar solicitudes: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const headers = ['ID', 'Usuario Solicitante ID', 'Equipo ID', 'Motivo', 'Estado', 'Fecha Solicitud', 'Acciones'];

  const renderRow = (item) => (
    <tr key={item.id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.usuario_id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.equipo_id || 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.motivo}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.estado}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.fecha_solicitud}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Button className="text-indigo-600 hover:text-indigo-900 mr-4 bg-transparent shadow-none" onClick={() => console.log('Ver Detalle', item.id)}>
          Ver Detalle
        </Button>
        {item.estado === 'Pendiente' && (
          <>
            <Button className="text-green-600 hover:text-green-900 mr-4 bg-transparent shadow-none" onClick={() => console.log('Aprobar', item.id)}>
              Aprobar
            </Button>
            <Button className="text-red-600 hover:text-red-900 bg-transparent shadow-none" onClick={() => console.log('Rechazar', item.id)}>
              Rechazar
            </Button>
          </>
        )}
      </td>
    </tr>
  );

  if (loading) return <Loader message="Cargando solicitudes..." className="mt-8" />;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Lista de Solicitudes</h3>
      <Table headers={headers} data={requests} renderRow={renderRow} />
    </Card>
  );
};

export default SolicitudesList;
