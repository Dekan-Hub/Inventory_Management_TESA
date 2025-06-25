import React from 'react';

/**
 * Loader: Componente para mostrar un indicador de carga.
 * Puede ser un spinner centrado en la pantalla o incrustado en un contenedor.
 * @param {object} props - Propiedades del componente.
 * @param {boolean} [props.fullScreen=false] - Si es true, el loader cubre toda la pantalla.
 * @param {string} [props.message='Cargando...'] - Mensaje opcional para mostrar junto al spinner.
 */
const Loader = ({ fullScreen = false, message = 'Cargando...' }) => {
    // Clases base para el contenedor del loader.
    const baseClasses = 'flex flex-col items-center justify-center font-inter';
    // Clases adicionales si el loader debe ocupar toda la pantalla.
    const fullScreenClasses = 'fixed inset-0 bg-gray-200 bg-opacity-75 z-50';

    return (
        <div className={`${baseClasses} ${fullScreen ? fullScreenClasses : 'p-4'}`}>
            {/* SVG de un spinner de carga. */}
            <svg
                className="animate-spin h-10 w-10 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            {/* Mensaje de carga opcional. */}
            <p className="mt-4 text-gray-700 text-lg">{message}</p>
        </div>
    );
};

export default Loader;