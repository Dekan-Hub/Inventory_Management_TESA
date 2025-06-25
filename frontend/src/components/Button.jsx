import React from 'react';

/**
 * Button: Componente de botón reutilizable con estilos de Tailwind CSS.
 * Permite diferentes variantes de estilo y manejo de estado deshabilitado.
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Contenido del botón (texto, iconos, etc.).
 * @param {function} props.onClick - Función que se llama cuando se hace clic en el botón.
 * @param {string} [props.className=''] - Clases adicionales de Tailwind para personalizar el estilo.
 * @param {string} [props.type='button'] - Tipo del botón HTML (button, submit, reset).
 * @param {boolean} [props.disabled=false] - Si es true, el botón estará deshabilitado.
 * @param {string} [props.variant='primary'] - Define el estilo visual del botón ('primary', 'secondary', 'danger', 'success').
 */
const Button = ({ children, onClick, className = '', type = 'button', disabled = false, variant = 'primary' }) => {
  // Clases base aplicadas a todos los botones para un estilo consistente.
  let baseClasses = "font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-75";
  // Clases específicas de la variante, que se determinarán por el switch.
  let variantClasses = '';

  // Determina las clases de color y hover/focus según la variante del botón.
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
      break;
    case 'secondary':
      variantClasses = 'bg-gray-300 hover:bg-gray-400 text-gray-800 focus:ring-gray-500';
      break;
    case 'danger':
      variantClasses = 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
      break;
    case 'success':
      variantClasses = 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500';
      break;
    default:
      // Variante por defecto si no se especifica o es inválida.
      variantClasses = 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
  }

  return (
    // Elemento botón HTML.
    <button
      type={type} // Tipo del botón.
      onClick={onClick} // Manejador de clics.
      disabled={disabled} // Estado deshabilitado.
      // Combinación de clases base, clases de variante, clases adicionales (className)
      // y clases condicionales para el estado deshabilitado.
      className={`${baseClasses} ${variantClasses} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children} {/* Contenido del botón. */}
    </button>
  );
};

export default Button;
