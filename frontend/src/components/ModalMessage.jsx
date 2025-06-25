import React from 'react';

/**
 * ModalMessage: Componente de modal reutilizable para mostrar mensajes de información, éxito, error o confirmación.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.message - El mensaje a mostrar en el modal. Si está vacío, el modal no se renderiza.
 * @param {string} props.type - El tipo de mensaje ('info', 'success', 'error', 'confirm').
 * @param {function} props.onClose - Función a ejecutar cuando el usuario cierra el modal.
 * @param {function} [props.onConfirm] - Función opcional a ejecutar si el modal es de tipo 'confirm' y el usuario confirma.
 */
const ModalMessage = ({ message, type, onClose, onConfirm }) => {
    // Si no hay mensaje, no renderiza el modal.
    if (!message) return null;

    // Define las clases de estilo y el título según el tipo de mensaje.
    let bgColor = 'bg-blue-500'; // Color de fondo por defecto para 'info'.
    let textColor = 'text-white'; // Color de texto por defecto.
    let buttonColor = 'bg-blue-600 hover:bg-blue-700'; // Color de botón por defecto.
    let title = 'Información'; // Título por defecto.

    // Ajusta los estilos y el título según el tipo de mensaje.
    if (type === 'error') {
        bgColor = 'bg-red-500';
        buttonColor = 'bg-red-600 hover:bg-red-700';
        title = 'Error';
    } else if (type === 'success') {
        bgColor = 'bg-green-500';
        buttonColor = 'bg-green-600 hover:bg-green-700';
        title = 'Éxito';
    } else if (type === 'confirm') {
        bgColor = 'bg-yellow-500';
        buttonColor = 'bg-yellow-600 hover:bg-yellow-700';
        title = 'Confirmación';
    }

    return (
        // Contenedor principal del modal: ocupa toda la pantalla, con fondo semitransparente.
        // Centra el contenido y tiene un alto z-index para estar por encima de otros elementos.
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4 font-inter">
            {/* Contenido del modal: card con colores dinámicos, sombra y animaciones. */}
            <div className={`${bgColor} ${textColor} p-6 rounded-lg shadow-xl max-w-sm w-full text-center space-y-4 transform scale-100 opacity-100 transition-all duration-300 ease-out`}>
                {/* Título del modal */}
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                {/* Mensaje principal del modal */}
                <p className="text-lg">{message}</p>
                {/* Contenedor de botones */}
                <div className="flex justify-center space-x-4 mt-4">
                    {/* Botón de Confirmar: Solo se muestra si la prop `onConfirm` está presente (para modales de tipo 'confirm'). */}
                    {onConfirm && (
                        <button
                            onClick={onConfirm} // Llama a la función onConfirm cuando se hace clic.
                            className={`${buttonColor} text-white font-bold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-75`}
                        >
                            Confirmar
                        </button>
                    )}
                    {/* Botón de Cerrar: Siempre presente. */}
                    <button
                        onClick={onClose} // Llama a la función onClose cuando se hace clic.
                        className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalMessage;
