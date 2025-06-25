// Importa React y hooks esenciales como useState, useEffect.
import React, { useState, useEffect, useContext } from 'react';
// Importa las funciones de servicio para crear y actualizar equipos.
import { createEquipo, updateEquipo } from '../../services/equiposService';
// Importa los componentes reutilizables Input, Button y Form.
import Input from '../../components/Input';
import Button from '../../components/Button';
import Form from '../../components/Form';
import { AuthContext } from '../../context/AuthContext'; // Para setGlobalMessage

/**
 * EquipoForm: Componente de formulario para agregar o editar un equipo.
 * Se puede usar dentro de un modal o como una sección en una página.
 * @param {object} props - Propiedades del componente.
 * @param {object} [props.equipo] - Objeto del equipo actual (si es para editar) o un objeto inicial vacío (si es para agregar).
 * @param {string} props.modalType - El tipo de operación del formulario ('add' para agregar, 'edit' para editar).
 * @param {function} props.onSave - Función de callback que se ejecuta después de guardar (con éxito o error).
 * @param {function} props.onCancel - Función de callback para cancelar la operación.
 */
const EquipoForm = ({ equipo, modalType, onSave, onCancel }) => {
    // Estado para almacenar los datos del formulario del equipo.
    // Se inicializa con los datos del `equipo` pasado por props o valores por defecto.
    const [formData, setFormData] = useState(equipo || {
        nombre: '',
        categoria: '',
        stock: 0,
        precio: 0,
        estado: 'Disponible'
    });
    // Estado para controlar el estado de carga durante el proceso de guardado/actualización.
    const [isLoading, setIsLoading] = useState(false);
    // Estado para almacenar los errores de validación por campo.
    const [errors, setErrors] = useState({});
    // Acceso al sistema de mensajes globales del AuthContext.
    const { setGlobalMessage } = useContext(AuthContext);

    // `useEffect` para actualizar `formData` y limpiar errores si la prop `equipo` o `modalType` cambian.
    // Esto es crucial para resetear el formulario cuando se abre para un nuevo equipo
    // o para editar uno diferente sin que los datos del modal anterior persistan.
    useEffect(() => {
        setFormData(equipo || { nombre: '', categoria: '', stock: 0, precio: 0, estado: 'Disponible' });
        setErrors({}); // Limpia errores al cambiar el equipo o el tipo de modal.
    }, [equipo, modalType]);

    /**
     * `validateForm`: Valida los campos del formulario.
     * @returns {boolean} True si el formulario es válido, false en caso contrario.
     */
    const validateForm = () => {
        let newErrors = {};
        if (!formData.nombre) newErrors.nombre = 'El nombre del equipo es requerido.';
        if (!formData.categoria) newErrors.categoria = 'La categoría es requerida.';
        if (formData.stock < 0) newErrors.stock = 'El stock no puede ser negativo.';
        if (formData.precio < 0) newErrors.precio = 'El precio no puede ser negativo.';

        setErrors(newErrors); // Actualiza el estado de errores.
        return Object.keys(newErrors).length === 0; // Retorna true si no hay errores.
    };

    /**
     * `handleChange`: Maneja los cambios en los campos de entrada del formulario.
     * Actualiza el estado `formData` con los nuevos valores y limpia errores del campo.
     * @param {object} e - Evento de cambio del input.
     */
    const handleChange = (e) => {
        const { id, value } = e.target;
        // Actualiza el estado `formData` inmutablemente.
        setFormData(prev => ({
            ...prev,
            // Convierte a número si el campo es 'stock' o 'precio', de lo contrario, guarda como string.
            [id]: id === 'stock' || id === 'precio' ? parseFloat(value) || 0 : value
        }));
        // Limpia el error del campo específico cuando el usuario empieza a escribir.
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: undefined }));
        }
    };

    /**
     * `handleSubmit`: Maneja el envío del formulario.
     * Llama a la función de servicio apropiada (crear o actualizar) y gestiona los callbacks.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene la recarga de la página.
        if (!validateForm()) return; // Si la validación falla, no procede.

        setIsLoading(true); // Activa el estado de carga.
        try {
            if (modalType === 'add') {
                await createEquipo(formData); // Si es un nuevo equipo, llama a `createEquipo`.
                onSave(true, 'Equipo agregado exitosamente.'); // Llama al callback de éxito.
            } else {
                await updateEquipo(formData._id, formData); // Si es un equipo existente, llama a `updateEquipo` con el ID.
                onSave(true, 'Equipo actualizado exitosamente.'); // Llama al callback de éxito.
            }
        } catch (error) {
            console.error('Error saving equipo:', error);
            const apiErrorMessage = error.response?.data?.message || error.message || 'Error desconocido';
            setGlobalMessage({ message: `Error al guardar equipo: ${apiErrorMessage}`, type: 'error' });
            onSave(false, `Error al guardar equipo: ${apiErrorMessage}`); // Pasa el error al callback principal.
        } finally {
            setIsLoading(false); // Desactiva el estado de carga al finalizar.
        }
    };

    return (
        // El componente `Form` proporciona el `onSubmit` y la gestión del `disabled`.
        // El `className="shadow-none p-0"` se usa porque este formulario estará dentro de un modal,
        // y el modal ya provee su propio estilo de sombra y padding.
        <Form onSubmit={handleSubmit} disabled={isLoading} className="shadow-none p-0">
            {/* Componentes Input para cada campo del equipo. */}
            <Input
                label="Nombre del Equipo"
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                error={errors.nombre}
                required
                disabled={isLoading}
            />
            <Input
                label="Categoría del Equipo"
                id="categoria"
                type="text"
                value={formData.categoria}
                onChange={handleChange}
                error={errors.categoria}
                required
                disabled={isLoading}
            />
            <Input
                label="Stock"
                id="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                error={errors.stock}
                disabled={isLoading}
            />
            <Input
                label="Precio"
                id="precio"
                type="number"
                step="0.01" // Permite valores decimales.
                value={formData.precio}
                onChange={handleChange}
                error={errors.precio}
                disabled={isLoading}
            />
            {/* Select para el estado del equipo. */}
            <div>
                <label htmlFor="estado" className="block text-gray-700 text-sm font-semibold mb-2">Estado</label>
                <select
                    id="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="border border-gray-300 rounded-lg w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="Disponible">Disponible</option>
                    <option value="Bajo Stock">Bajo Stock</option>
                    <option value="Agotado">Agotado</option>
                </select>
            </div>

            {/* Contenedor de los botones de acción. */}
            <div className="flex justify-end space-x-4 mt-8">
                {/* Botón para cancelar y cerrar el modal. */}
                <Button onClick={onCancel} disabled={isLoading} variant="secondary">
                    Cancelar
                </Button>
                {/* Botón para enviar el formulario y guardar el equipo. */}
                <Button type="submit" isLoading={isLoading} variant="primary">
                    {isLoading ? 'Guardando...' : 'Guardar'} {/* Texto dinámico según el estado de carga. */}
                </Button>
            </div>
        </Form>
    );
};

export default EquipoForm;