import React, { useState, useEffect, useContext } from 'react';
import { createUsuario, updateUsuario } from '../../services/usuariosService';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Form from '../../components/Form';
import { AuthContext } from '../../context/AuthContext'; // Para setGlobalMessage

/**
 * UsuarioForm: Componente de formulario para agregar o editar un usuario.
 * Se puede usar dentro de un modal o como una página independiente.
 * @param {object} props - Propiedades del componente.
 * @param {object} [props.usuario] - Objeto del usuario actual (si es para editar) o vacío (si es para agregar).
 * @param {string} props.modalType - El tipo de operación del formulario ('add' para agregar, 'edit' para editar).
 * @param {function} props.onSave - Función de callback que se ejecuta después de guardar (con éxito o error).
 * @param {function} props.onCancel - Función de callback para cancelar la operación.
 */
const UsuarioForm = ({ usuario, modalType, onSave, onCancel }) => {
    // Inicializa el estado del formulario con los datos del usuario o valores por defecto.
    const [formData, setFormData] = useState(usuario || {
        username: '',
        email: '',
        password: '',
        role: 'user' // Rol predeterminado.
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({}); // Estado para errores de validación del formulario.
    const { setGlobalMessage } = useContext(AuthContext); // Acceso al sistema de mensajes globales

    // Sincroniza `formData` con la prop `usuario` si cambia (útil para el modal de edición).
    useEffect(() => {
        setFormData(usuario || { username: '', email: '', password: '', role: 'user' });
        setErrors({}); // Limpia errores al cambiar de usuario/tipo de modal.
    }, [usuario, modalType]);

    /**
     * `validateForm`: Valida los campos del formulario.
     * @returns {boolean} True si el formulario es válido, false en caso contrario.
     */
    const validateForm = () => {
        let newErrors = {};
        if (!formData.username) newErrors.username = 'El nombre de usuario es requerido.';
        if (!formData.email) {
            newErrors.email = 'El email es requerido.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El email no es válido.';
        }
        if (modalType === 'add' && !formData.password) newErrors.password = 'La contraseña es requerida.';
        if (formData.password && formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retorna true si no hay errores.
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        // Limpia el error del campo específico cuando el usuario empieza a escribir.
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Si la validación falla, no procede.

        setIsLoading(true);
        try {
            if (modalType === 'add') {
                await createUsuario(formData);
                onSave(true, 'Usuario agregado exitosamente.');
            } else {
                // Asegúrate de no enviar la contraseña si no ha sido modificada explícitamente y no está vacía
                // O envía un objeto con solo los campos actualizados
                const dataToUpdate = { ...formData };
                if (!dataToUpdate.password) {
                    delete dataToUpdate.password; // No enviar la contraseña si está vacía
                }
                await updateUsuario(formData._id, dataToUpdate);
                onSave(true, 'Usuario actualizado exitosamente.');
            }
        } catch (error) {
            console.error('Error saving user:', error);
            // Muestra un error más específico si viene del backend.
            const apiErrorMessage = error.response?.data?.message || error.message || 'Error desconocido';
            setGlobalMessage({ message: `Error al guardar usuario: ${apiErrorMessage}`, type: 'error' });
            onSave(false, `Error al guardar usuario: ${apiErrorMessage}`); // Pasa el error al callback principal
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} disabled={isLoading} className="shadow-none p-0">
            <Input
                label="Nombre de Usuario"
                id="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                required
                disabled={isLoading}
            />
            <Input
                label="Email"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                disabled={isLoading}
            />
            {/* El campo de contraseña es requerido al agregar, opcional al editar. */}
            <Input
                label="Contraseña"
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required={modalType === 'add'}
                placeholder={modalType === 'edit' ? 'Dejar en blanco para no cambiar' : ''}
                disabled={isLoading}
            />
            <div>
                <label htmlFor="role" className="block text-gray-700 text-sm font-semibold mb-2">Rol</label>
                <select
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="border border-gray-300 rounded-lg w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
                <Button onClick={onCancel} disabled={isLoading} variant="secondary">
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isLoading} variant="primary">
                    {isLoading ? 'Guardando...' : 'Guardar'}
                </Button>
            </div>
        </Form>
    );
};

export default UsuarioForm;
