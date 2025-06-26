import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx'; // Correcto: Importa useAuth hook

/**
 * EquiposIndex: Componente principal para la sección de gestión de equipos.
 * Este actúa como el "index" de la carpeta Equipos.
 */
const EquiposIndex = () => {
  const { user } = useAuth(); // Obtenemos el usuario del contexto

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md min-h-[60vh] flex flex-col justify-center items-center text-center">
      <h3 className="text-3xl font-bold text-gray-700 mb-4">Gestión de Equipos</h3>
      <p className="text-gray-600 mb-6 max-w-2xl">
        Esta es la sección principal donde se administrarán todos los equipos del inventario.
        {/* Renderizado condicional de texto basado en el rol para aclarar permisos */}
        {user && ['administrador', 'técnico'].includes(user.rol) && (
          <span className="block mt-2">Como <span className="font-semibold capitalize">{user.rol}</span>, tendrás permisos para añadir, editar y eliminar equipos.</span>
        )}
        {user && user.rol === 'usuario' && (
          <span className="block mt-2">Como <span className="font-semibold capitalize">{user.rol}</span>, podrás consultar y solicitar equipos.</span>
        )}
      </p>
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 w-full max-w-lg">
        <p className="text-gray-700 font-medium">
          ¡Aquí se implementará la tabla de equipos y formularios de gestión!
          (Por ejemplo, podrías renderizar {'<EquipoList />'} y {'<EquipoForm />'} aquí)
        </p>
        <p className="text-sm text-gray-500 mt-2">Esta sección es visible para todos los roles que pueden acceder al dashboard.</p>
      </div>
    </div>
  );
};

export default EquiposIndex;
