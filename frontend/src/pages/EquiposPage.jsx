import React, { useEffect, useState } from 'react';
import { getEquipos, deleteEquipo, createEquipo, updateEquipo } from '../services/equiposService';
import Table from '../components/Table';
import EquipoForm from '../components/EquipoForm';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'estado', label: 'Estado' },
  { key: 'ubicacion', label: 'Ubicación' },
];

export default function EquiposPage() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editEquipo, setEditEquipo] = useState(null);

  const fetchEquipos = async () => {
    setLoading(true);
    try {
      const { data } = await getEquipos(filtro ? { search: filtro } : {});
      // Mapear los campos anidados para la tabla
      const equiposMapeados = (data.data || data).map(eq => ({
        id: eq.id,
        nombre: eq.nombre,
        tipo: eq.tipoEquipo?.nombre || '',
        estado: eq.estadoEquipo?.estado || '',
        ubicacion: eq.ubicacion ? `${eq.ubicacion.edificio} - ${eq.ubicacion.sala}` : '',
        // Puedes agregar más campos si lo deseas
      }));
      setEquipos(equiposMapeados);
    } catch (err) {
      // TODO: mostrar error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipos();
    // eslint-disable-next-line
  }, [filtro]);

  const handleDelete = async (row) => {
    if (window.confirm('¿Eliminar equipo?')) {
      await deleteEquipo(row.id);
      fetchEquipos();
    }
  };

  const handleEdit = (row) => {
    setEditEquipo(row);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditEquipo(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (values) => {
    if (editEquipo) {
      await updateEquipo(editEquipo.id, values);
    } else {
      await createEquipo(values);
    }
    setShowForm(false);
    fetchEquipos();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
        <button className="bg-primary text-white px-4 py-2 rounded font-bold" onClick={handleNew}>Nuevo equipo</button>
      </div>
      <Table
        columns={columns}
        data={equipos}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <EquipoForm
              initialValues={editEquipo}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 