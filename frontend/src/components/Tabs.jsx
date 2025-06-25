import React from 'react';

/**
 * Tabs: Componente de pestañas para navegación dentro de secciones.
 * Permite definir una lista de pestañas y un contenido que cambia según la pestaña activa.
 * @param {object} props - Propiedades del componente.
 * @param {Array<object>} props.tabs - Un array de objetos, donde cada objeto define una pestaña.
 * Ej: [{ label: 'Pestaña 1', content: <Componente1 /> }]
 * @param {number} props.activeIndex - El índice de la pestaña que está actualmente activa.
 * @param {function} props.onTabChange - Función que se llama cuando se selecciona una nueva pestaña (recibe el índice).
 * @param {string} [props.className=''] - Clases CSS adicionales de Tailwind para personalizar el contenedor de las pestañas.
 */
const Tabs = ({ tabs, activeIndex, onTabChange, className = '' }) => {
    return (
        <div className={`w-full font-inter ${className}`}>
            {/* Contenedor de los botones de las pestañas. */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => onTabChange(index)}
                            // Clases condicionales para resaltar la pestaña activa.
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ease-in-out
                                ${index === activeIndex
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            aria-current={index === activeIndex ? 'page' : undefined}
                        >
                            {tab.label} {/* Etiqueta de la pestaña. */}
                        </button>
                    ))}
                </nav>
            </div>
            {/* Contenido de la pestaña activa. */}
            <div className="mt-6">
                {tabs[activeIndex] ? tabs[activeIndex].content : null}
            </div>
        </div>
    );
};

export default Tabs;
