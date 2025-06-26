import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx'; // Correcto: Importa useAuth hook

/**
 * MantenimientosIndex: Componente principal para la sección de gestión de mantenimientos.
 * Accesible por: 'administrador', 'técnico'.
 */
const MantenimientosIndex = () => {
  const { user } = useAuth(); // Obtenemos el usuario del contexto

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
      <h3 className="text-3xl font-bold text-gray-700 mb-4">Registro y Consulta de Mantenimientos</h3>
      <p className="text-gray-600 mb-6 max-w-2xl">
        Esta sección permite registrar, consultar y gestionar los mantenimientos técnicos de los equipos.
      </p>
      <div className="bg-green-50 p-6 rounded-xl border border-green-200 w-full max-w-lg">
        <p className="text-green-700 font-medium">¡Aquí se implementarán los formularios y listados de mantenimientos!</p>
        <p className="text-sm text-green-500 mt-2">Visible y accesible para los roles '<span className="font-semibold">administrador</span>' y '<span className="font-semibold">técnico</span>'.</p>
      </div>
    </div>
  );
};

export default MantenimientosIndex;
