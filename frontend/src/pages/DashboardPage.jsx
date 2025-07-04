import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/dashboardService';
import Card from '../components/Card';
import Loader from '../components/Loader';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalEquipos: 0,
    equiposEnMantenimiento: 0,
    equiposCorrectivo: 0,
    totalCategorias: 0,
    solicitudesPendientes: 0,
    movimientosRecientes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Error al cargar las estadísticas del dashboard.');
      console.error('Error en dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="w-full">
      <h1 className="text-3xl font-extrabold text-primary mb-8 text-left">Panel de control</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full mb-8">
        <Card className="bg-blue-100 flex flex-col items-center">
          <span className="text-5xl font-bold text-blue-800 mb-2">{stats.totalEquipos}</span>
          <span className="text-xl font-semibold text-blue-900">Total de equipos</span>
        </Card>
        <Card className="bg-yellow-100 flex flex-col items-center">
          <span className="text-5xl font-bold text-yellow-700 mb-2">{stats.equiposEnMantenimiento}</span>
          <span className="text-xl font-semibold text-yellow-800">En mantenimiento</span>
        </Card>
        <Card className="bg-red-100 flex flex-col items-center">
          <span className="text-5xl font-bold text-red-700 mb-2">{stats.equiposCorrectivo}</span>
          <span className="text-xl font-semibold text-red-800">En correctivo</span>
        </Card>
        <Card className="bg-green-100 flex flex-col items-center">
          <span className="text-5xl font-bold text-green-700 mb-2">{stats.totalCategorias}</span>
          <span className="text-xl font-semibold text-green-800">Total de Categorías</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-purple-100 flex flex-col items-center">
          <span className="text-4xl font-bold text-purple-700 mb-2">{stats.solicitudesPendientes}</span>
          <span className="text-lg font-semibold text-purple-800">Solicitudes pendientes</span>
        </Card>
        <Card className="bg-orange-100 flex flex-col items-center">
          <span className="text-4xl font-bold text-orange-700 mb-2">{stats.movimientosRecientes}</span>
          <span className="text-lg font-semibold text-orange-800">Movimientos recientes</span>
        </Card>
      </div>

      <Card className="bg-white text-center text-lg">
        <h2 className="text-2xl font-bold text-primary mb-4">Bienvenido al sistema de inventario TESA</h2>
        <p className="text-gray-600">
          Sistema de gestión integral para el control de equipos, mantenimientos y movimientos del Tecnológico San Antonio.
        </p>
      </Card>
    </div>
  );
} 