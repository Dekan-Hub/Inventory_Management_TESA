import React from 'react';

/**
 * Form: Componente contenedor para formularios con estilos consistentes.
 * Proporciona un padding, fondo y sombra predeterminados, y maneja el evento de envío.
 * @param {object} props - Propiedades del componente.
 * @param {function} props.onSubmit - Función que se llama cuando se envía el formulario (previniendo el comportamiento predeterminado).
 * @param {React.ReactNode} props.children - Los elementos hijos que representan los campos y botones del formulario.
 * @param {string} [props.className=''] - Clases CSS adicionales de Tailwind para personalizar el formulario.
 * @param {boolean} [props.disabled=false] - Si es true, puede usarse para deshabilitar interacciones dentro del formulario (útil con Loader).
 * @param {object} [props.rest] - Cualquier otra propiedad HTML estándar para el elemento `<form>`.
 */
const Form = ({
    onSubmit,       // Manejador del evento submit.
    children,       // Contenido del formulario.
    className = '', // Clases adicionales.
    disabled = false, // Deshabilitar el formulario.
    ...rest         // Otras props.
}) => {
    // Manejador para el evento de envío del formulario.
    const handleSubmit = (e) => {
        e.preventDefault(); // Previene el comportamiento predeterminado de recarga de la página.
        if (onSubmit && !disabled) { // Solo llama a onSubmit si no está deshabilitado.
            onSubmit(e);
        }
    };

    return (
        // Contenedor principal del formulario.
        // Clases de Tailwind: fondo blanco, padding, bordes redondeados, sombra.
        <form
            onSubmit={handleSubmit} // Asigna el manejador de envío.
            className={`bg-white p-8 rounded-lg shadow-md font-inter ${className}`}
            {...rest} // Pasa cualquier otra prop HTML al formulario nativo.
        >
            {/* Renderiza los elementos hijos (campos de entrada, botones, etc.). */}
            <fieldset disabled={disabled} className="space-y-4">
                {/* Fieldset deshabilita todos los controles dentro si `disabled` es true. */}
                {children}
            </fieldset>
        </form>
    );
};

export default Form;
