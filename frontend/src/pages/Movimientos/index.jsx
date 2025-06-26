import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * MovimientosIndex: Componente principal para la sección de movimientos de equipos.
 * Accesible por: 'administrador', 'técnico'.
 */
const MovimientosIndex = () => {
  const { user } = useAuth();

  if (!user || !['administrador', 'técnico'].includes(user.rol)) {
    return (
      <div className="bg-red-100 p-8 rounded-2xl shadow-md text-center min-h-[60vh] flex flex-col items-center justify-center border-2 border-red-300">
        <h3 className="text-3xl font-bold text-red-700 mb-4">Acceso No Autorizado</h3>
        <p className="text-red-600 text-lg font-medium">Solo administradores y técnicos pueden ver esta sección.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md min-h-[60vh] flex flex-col justify-center items-center text-center">
      <h3 className="text-3xl font-bold text-gray-700 mb-4">Registro y Historial de Movimientos</h3>
      <p className="text-gray-600 mb-6 max-w-2xl">
        Aquí podrás registrar los traslados de equipos y consultar el historial de movimientos.
      </p>
      <div className="bg-teal-50 p-6 rounded-xl border border-teal-200 w-full max-w-lg">
        <p className="text-teal-700 font-medium">¡Aquí se implementarán formularios para nuevos movimientos y tablas con el historial!</p>
        <p className="text-sm text-teal-500 mt-2">Visible y accesible para los roles '<span className="font-semibold">administrador</span>' y '<span className="font-semibold">técnico</span>'.</p>
      </div>
    </div>
  );
};

export default MovimientosIndex;
