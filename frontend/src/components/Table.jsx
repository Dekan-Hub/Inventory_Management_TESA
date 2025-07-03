import React from 'react';

export default function Table({ columns, data, onEdit, onDelete, loading }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-2 bg-primary text-white text-left font-bold">{col.label}</th>
            ))}
            {(onEdit || onDelete) && <th className="px-4 py-2 bg-primary text-white">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={columns.length + 1} className="text-center py-8">Cargando...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={columns.length + 1} className="text-center py-8">Sin datos</td></tr>
          ) : data.map(row => (
            <tr key={row.id} className="border-b hover:bg-light">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-2">{row[col.key]}</td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-2 flex gap-2">
                  {onEdit && <button className="text-primary hover:underline" onClick={() => onEdit(row)}>Editar</button>}
                  {onDelete && <button className="text-red-600 hover:underline" onClick={() => onDelete(row)}>Eliminar</button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 