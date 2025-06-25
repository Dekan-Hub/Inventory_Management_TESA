import React from 'react';

/**
 * Input: Componente de campo de entrada reutilizable para formularios.
 * Proporciona un label asociado al input y estilos consistentes.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.label - El texto del label para el input.
 * @param {string} props.id - El ID único del input, usado para asociarlo con el label.
 * @param {string} [props.type='text'] - El tipo de input HTML (text, number, password, email, etc.).
 * @param {string|number} props.value - El valor actual del input (controlado por el estado del padre).
 * @param {function} props.onChange - Función que se llama cuando el valor del input cambia.
 * @param {string} [props.placeholder] - Texto de placeholder para el input.
 * @param {boolean} [props.disabled=false] - Si es true, el input estará deshabilitado.
 * @param {string} [props.step] - Atributo 'step' para inputs de tipo 'number' (ej. "0.01").
 */
const Input = ({ label, id, type = 'text', value, onChange, placeholder, disabled = false, step }) => {
  return (
    <div>
      {/* Label para el input, asociado por el atributo 'htmlFor' al 'id' del input. */}
      <label htmlFor={id} className="block text-gray-700 text-sm font-semibold mb-2">
        {label}
      </label>
      {/* Elemento input HTML. */}
      <input
        id={id} // ID único.
        type={type} // Tipo de input (text, number, password, etc.).
        value={value} // Valor controlado.
        onChange={onChange} // Manejador de cambios.
        placeholder={placeholder} // Texto de marcador de posición.
        disabled={disabled} // Estado deshabilitado.
        step={step} // Paso para inputs numéricos.
        // Clases de Tailwind para estilizar el input:
        // Sombra, apariencia limpia, borde, bordes redondeados, padding, texto, foco, transiciones.
        className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
      />
    </div>
  );
};

export default Input;
