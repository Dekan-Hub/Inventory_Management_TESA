import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * ReportesIndex: Componente principal para la sección de reportes.
 * Accesible solo por: 'administrador'.
 */
const ReportesIndex = () => {
  const { user } = useAuth();

  if (user?.rol !== 'administrador') {
    return (
      <div className="bg-red-100 p-8 rounded-2xl shadow-md text-center min-h-[60vh] flex flex-col items-center justify-center border-2 border-red-300">
        <h3 className="text-3xl font-bold text-red-700 mb-4">Acceso No Autorizado</h3>
        <p className="text-red-600 text-lg font-medium">Solo los administradores pueden ver esta sección.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md min-h-[60vh] flex flex-col justify-center items-center text-center">
      <h3 className="text-3xl font-bold text-gray-700 mb-4">Generación y Consulta de Reportes</h3>
      <p className="text-gray-600 mb-6 max-w-2xl">
        Esta sección permite generar diversos reportes, KPIs y exportaciones de datos del sistema.
      </p>
      <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 w-full max-w-lg">
        <p className="text-orange-700 font-medium">¡Aquí se implementarán las opciones de generación y descarga de reportes!</p>
        <p className="text-sm text-orange-500 mt-2">Solo visible y accesible para el rol '<span className="font-semibold">administrador</span>'.</p>
      </div>
    </div>
  );
};

export default ReportesIndex;
