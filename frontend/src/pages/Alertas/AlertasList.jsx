import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';

/**
 * AlertasIndex: Componente principal para la sección de alertas y notificaciones.
 * Accesible por: 'administrador', 'técnico', 'usuario'.
 */
const AlertasIndex = () => {
  const { user } = useContext(AuthContext);

  if (!user || !['administrador', 'técnico', 'usuario'].includes(user.rol)) {
    return (
      <div className="bg-red-100 p-8 rounded-2xl shadow-md text-center min-h-[60vh] flex flex-col items-center justify-center border-2 border-red-300">
        <h3 className="text-3xl font-bold text-red-700 mb-4">Acceso No Autorizado</h3>
        <p className="text-red-600 text-lg font-medium">No tienes permiso para ver esta sección.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md min-h-[60vh] flex flex-col justify-center items-center text-center">
      <h3 className="text-3xl font-bold text-gray-700 mb-4">Centro de Alertas y Notificaciones</h3>
      <p className="text-gray-600 mb-6 max-w-2xl">
        Aquí podrás ver todas las alertas y notificaciones relevantes del sistema.
      </p>
      <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 w-full max-w-lg">
        <p className="text-yellow-700 font-medium">¡Aquí se implementará el listado de alertas!</p>
        <p className="text-sm text-yellow-500 mt-2">Visible y accesible para todos los roles.</p>
      </div>
    </div>
  );
};

export default AlertasIndex;
