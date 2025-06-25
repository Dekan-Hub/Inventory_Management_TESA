import React from 'react';

/**
 * Card: Componente de tarjeta reutilizable para mostrar estadísticas o información resumida.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.stat - Objeto con los datos de la estadística.
 * @param {string} props.stat.label - Etiqueta de la estadística (ej. "Total de Productos").
 * @param {number|string} props.stat.value - Valor de la estadística.
 * @param {string} props.stat.icon - Icono (emoji o SVG) a mostrar junto a la estadística.
 * @param {boolean} [props.stat.highlight] - Si es true, añade un borde de resaltado.
 */
const Card = ({ stat }) => (
    // Contenedor principal de la tarjeta.
    // Clases de Tailwind para estilo: fondo blanco, padding, bordes redondeados, sombra, flexbox para alinear contenido.
    // Añade un borde lateral si `stat.highlight` es true.
    <div className={`bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 ${stat.highlight ? 'border-l-4 border-yellow-500' : ''}`}>
        {/* Contenedor del icono: círculo con color de fondo y texto dinámico. */}
        <div className={`p-3 rounded-full ${stat.highlight ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
            {/* El icono (ej. un emoji) se muestra con un tamaño grande. */}
            <span className="text-2xl">{stat.icon}</span>
        </div>
        {/* Contenedor del texto de la estadística. */}
        <div>
            {/* Etiqueta de la estadística. */}
            <p className="text-gray-500 text-sm">{stat.label}</p>
            {/* Valor de la estadística, con estilo de texto grande y en negrita. */}
            <h2 className="text-3xl font-bold text-gray-900">{stat.value}</h2>
        </div>
    </div>
);

export default Card;
