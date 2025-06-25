import React, { useEffect, useRef } from 'react'; // Importa React, useEffect y useRef.
import Button from './Button'; // Importa el componente Button.

/**
 * Modal: Componente de ventana modal genérico y reutilizable.
 * Muestra contenido sobre un fondo semi-transparente, con opciones de título, mensaje,
 * y botones de confirmación/cancelación.
 * @param {object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Si es true, el modal es visible; de lo contrario, está oculto.
 * @param {function} props.onClose - Función que se llama cuando se solicita cerrar el modal (ej. clic en cerrar o cancelar).
 * @param {string} props.title - El título que se muestra en la cabecera del modal.
 * @param {string} [props.message] - Un mensaje de texto para mostrar en el cuerpo del modal.
 * @param {React.ReactNode} [props.children] - Contenido React a renderizar dentro del cuerpo del modal (si es más complejo que un simple mensaje).
 * @param {function} [props.onConfirm] - Función que se llama cuando se hace clic en el botón de confirmación.
 * @param {string} [props.confirmText='Aceptar'] - Texto para el botón de confirmación.
 * @param {boolean} [props.showCancelButton=true] - Si es true, muestra el botón de cancelar.
 * @param {boolean} [props.isLoading=false] - Si es true, los botones se deshabilitan y muestran estado de carga.
 */
const Modal = ({
    isOpen,             // Controla la visibilidad del modal.
    onClose,            // Función para cerrar el modal.
    title,              // Título del modal.
    message,            // Mensaje de texto del modal.
    children,           // Contenido personalizado del modal.
    onConfirm,          // Función al confirmar.
    confirmText = 'Aceptar', // Texto del botón de confirmar.
    showCancelButton = true, // Mostrar botón de cancelar por defecto.
    isLoading = false   // Estado de carga para los botones.
}) => {
    // Si el modal no está abierto, no renderiza nada.
    if (!isOpen) return null;

    const modalRef = useRef(null); // Ref para el contenido del modal.

    // useEffect para manejar el enfoque inicial y el bloqueo del scroll.
    useEffect(() => {
        if (isOpen) {
            // Enfocar el modal o un elemento dentro de él para accesibilidad.
            modalRef.current?.focus();
            // Bloquear el scroll del body cuando el modal está abierto.
            document.body.style.overflow = 'hidden';
        }
        // Limpiar al desmontar o cuando el modal se cierra.
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Manejador para cerrar el modal si se hace clic fuera de su contenido.
    const handleBackdropClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    return (
        // Contenedor principal del modal: fondo semi-transparente que cubre toda la pantalla.
        <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4 font-inter"
            onClick={handleBackdropClick} // Cierra al hacer clic en el fondo.
        >
            {/* Contenido del modal: card con padding, bordes redondeados, sombra, y máximo ancho. */}
            <div
                ref={modalRef} // Asigna la ref al contenido del modal.
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabIndex="-1" // Permite enfocar el modal para accesibilidad.
                className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full flex flex-col"
                onClick={(e) => e.stopPropagation()} // Previene que el clic dentro del modal cierre el modal.
            >
                {/* Cabecera del modal: título y botón de cierre. */}
                <div className="flex justify-between items-center mb-6">
                    <h3 id="modal-title" className="text-2xl font-bold text-gray-800">
                        {title}
                    </h3>
                    {/* Botón de cierre (icono "x"). */}
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1 transition duration-200"
                        aria-label="Cerrar modal"
                        disabled={isLoading}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cuerpo del modal: mensaje o contenido personalizado. */}
                <div className="mb-6 text-gray-700 text-base flex-grow">
                    {message && <p className="mb-4">{message}</p>}
                    {children} {/* Renderiza los hijos si se proporcionan. */}
                </div>

                {/* Pie del modal: botones de acción. */}
                <div className="flex justify-end space-x-4 mt-auto">
                    {/* Botón de cancelar, si `showCancelButton` es true. */}
                    {showCancelButton && (
                        <Button
                            onClick={onClose}
                            variant="secondary"
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                    )}
                    {/* Botón de confirmar, si `onConfirm` se proporciona. */}
                    {onConfirm && (
                        <Button
                            onClick={onConfirm}
                            variant="primary"
                            isLoading={isLoading} // Muestra spinner si está cargando.
                        >
                            {confirmText}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
