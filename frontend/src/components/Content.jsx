import React from 'react';

/**
 * Content: Componente contenedor principal para el contenido de las páginas.
 * Proporciona un padding consistente y un color de fondo base para el área de contenido.
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Los elementos hijos que se renderizarán dentro del contenedor.
 */
const Content = ({ children }) => {
    return (
        // Contenedor principal del contenido.
        // Clases de Tailwind: padding uniforme, fondo gris claro, ocupa el espacio restante (flex-1),
        // permite desplazamiento vertical si el contenido excede la altura.
        <div className="p-6 bg-gray-100 flex-1 overflow-y-auto font-inter">
            {children} {/* Renderiza los elementos hijos. */}
        </div>
    );
};

export default Content;
