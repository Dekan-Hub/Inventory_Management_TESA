import React from 'react';

/**
 * AccessDenied: Componente que se muestra cuando el usuario no tiene permisos
 * para acceder a una sección específica de la aplicación.
 */
const AccessDenied = () => {
  return (
    <div className="bg-red-100 p-8 rounded-2xl shadow-md text-center min-h-[60vh] flex flex-col items-center justify-center border-2 border-red-300">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 text-red-500 mb-8 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
      <h3 className="text-4xl font-extrabold text-red-700 mb-4">Acceso Denegado</h3>
      <p className="text-red-600 text-lg font-medium">Lo sentimos, no tienes los permisos necesarios para ver esta sección.</p>
      <p className="text-red-500 text-md mt-2">Por favor, contacta al administrador si crees que esto es un error.</p>
    </div>
  );
};

export default AccessDenied;
