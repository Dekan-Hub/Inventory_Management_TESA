import React, { useEffect, useState } from 'react';
import { getReportes } from '../../services/reportesService';
import Table from '../../components/Table';

export default function ReportesDashboard() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportes = async () => {
      setLoading(true);
      const res = await getReportes();
      setReportes(res.data);
      setLoading(false);
    };
    fetchReportes();
  }, []);

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'descargar', label: 'Descargar', render: (row) => (
      <a href={row.url} className="text-primary hover:underline" download>Descargar</a>
    ) },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reportes</h2>
      <Table columns={columns} data={reportes} loading={loading} />
    </div>
  );
} 