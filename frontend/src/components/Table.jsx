import React from 'react';

export default function Table({ columns = [], data = [], onEdit, onDelete, onResponder, loading = false }) {
  // Validaciones para evitar errores
  if (!Array.isArray(columns) || !Array.isArray(data)) {
    console.error('Table: columns y data deben ser arrays', { columns, data });
    return (
      <div className="text-center py-8 text-red-600">
        Error: Datos de tabla inválidos
      </div>
    );
  }

  const columnCount = columns.length + (onEdit || onDelete || onResponder ? 1 : 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-2 bg-primary text-white text-left font-bold">
                {col.label || col.key}
              </th>
            ))}
            {(onEdit || onDelete || onResponder) && <th className="px-4 py-2 bg-primary text-white">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columnCount} className="text-center py-8">
                Cargando...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="text-center py-8">
                Sin datos
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.id || index} className="border-b hover:bg-light">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-2">
                    {col.render ? col.render(row) : (row[col.key] || '')}
                  </td>
                ))}
                {(onEdit || onDelete || onResponder) && (
                  <td className="px-4 py-2 flex gap-2">
                    {onResponder && (
                      <button 
                        className="text-blue-600 hover:underline" 
                        onClick={() => onResponder(row)}
                      >
                        Responder
                      </button>
                    )}
                    {onEdit && (
                      <button 
                        className="text-primary hover:underline" 
                        onClick={() => onEdit(row)}
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        className="text-red-600 hover:underline" 
                        onClick={() => onDelete(row)}
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 