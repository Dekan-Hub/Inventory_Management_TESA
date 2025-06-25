import React from 'react';

/**
 * Table: Componente de tabla genérica para mostrar datos tabulares.
 * Permite definir las columnas y los datos, y renderiza la tabla con estilos de Tailwind.
 * @param {object} props - Propiedades del componente.
 * @param {Array<object>} props.columns - Un array de objetos que define las columnas de la tabla.
 * Cada objeto debe tener al menos `header` (string) y opcionalmente `accessor` (string)
 * o `render` (function para renderizado personalizado).
 * Ej: [{ header: 'Nombre', accessor: 'name' }, { header: 'Acciones', render: (row) => <Button>...</Button> }]
 * @param {Array<object>} props.data - Un array de objetos, donde cada objeto representa una fila de datos.
 * @param {string} [props.emptyMessage='No hay datos para mostrar.'] - Mensaje a mostrar cuando la tabla está vacía.
 * @param {string} [props.className=''] - Clases CSS adicionales de Tailwind para personalizar la tabla.
 */
const Table = ({ columns, data, emptyMessage = 'No hay datos para mostrar.', className = '' }) => {
    return (
        <div className={`overflow-x-auto rounded-lg shadow-md bg-white font-inter ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {/* Mapea sobre la definición de columnas para crear los encabezados. */}
                        {columns.map((col, index) => (
                            <th
                                key={col.accessor || col.header || index} // Usa accessor o header como key, o index.
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {col.header} {/* Texto del encabezado. */}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {/* Renderiza las filas de datos o el mensaje de vacío. */}
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={row._id || rowIndex} className="hover:bg-gray-50">
                                {/* Mapea sobre las columnas para renderizar las celdas de cada fila. */}
                                {columns.map((col, colIndex) => (
                                    <td key={col.accessor || col.header || colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {/* Si hay una función `render`, la usa; de lo contrario, usa el `accessor` para obtener el valor. */}
                                        {col.render ? col.render(row) : (col.accessor ? row[col.accessor] : '')}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            {/* Mensaje de tabla vacía, abarcando todas las columnas. */}
                            <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
