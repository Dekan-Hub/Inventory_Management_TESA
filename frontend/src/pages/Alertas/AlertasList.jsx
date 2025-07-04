import React, { useEffect, useState } from 'react';
import { getAlertas } from '../../services/alertasService';

export default function AlertasList() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlertas = async () => {
      setLoading(true);
      const res = await getAlertas();
      setAlertas(res.data);
      setLoading(false);
    };
    fetchAlertas();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Alertas</h2>
      {loading ? (
        <div>Cargando...</div>
      ) : alertas.length === 0 ? (
        <div>No hay alertas.</div>
      ) : (
        <ul className="space-y-2">
          {alertas.map(alerta => (
            <li key={alerta.id} className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow">
              <strong>{alerta.titulo}</strong>: {alerta.descripcion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 