import React, { useState, useEffect, useContext } from 'react';
import { createSolicitud, updateSolicitud } from '../../services/solicitudesService';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Form from '../../components/Form';
import { AuthContext } from '../../context/AuthContext';

/**
 * SolicitudForm: Componente de formulario para crear o editar una solicitud.
 * @param {object} props - Propiedades del componente.
 * @param {object} [props.solicitud] - Objeto de la solicitud actual (para editar) o inicial vacío (para agregar).
 * @param {string} props.modalType - Tipo de operación ('add' o 'edit').
 * @param {function} props.onSave - Callback al guardar la solicitud.
 * @param {function} props.onCancel - Callback al cancelar.
 */
const SolicitudForm = ({ solicitud, modalType, onSave, onCancel }) => {
    const [formData, setFormData] = useState(solicitud || {
        usuario: '',
        equipo: '',
        motivo: '',
        estado: 'Pendiente'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { setGlobalMessage } = useContext(AuthContext);

    useEffect(() => {
        setFormData(solicitud || { usuario: '', equipo: '', motivo: '', estado: 'Pendiente' });
        setErrors({});
    }, [solicitud, modalType]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.usuario) newErrors.usuario = 'El nombre de usuario es requerido.';
        if (!formData.equipo) newErrors.equipo = 'El nombre del equipo es requerido.';
        if (!formData.motivo) newErrors.motivo = 'El motivo de la solicitud es requerido.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            if (modalType === 'add') {
                await createSolicitud(formData);
                onSave(true, 'Solicitud agregada exitosamente.');
            } else {
                await updateSolicitud(formData._id, formData);
                onSave(true, 'Solicitud actualizada exitosamente.');
            }
        } catch (error) {
            console.error('Error saving solicitud:', error);
            const apiErrorMessage = error.response?.data?.message || error.message || 'Error desconocido';
            setGlobalMessage({ message: `Error al guardar solicitud: ${apiErrorMessage}`, type: 'error' });
            onSave(false, `Error al guardar solicitud: ${apiErrorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} disabled={isLoading} className="shadow-none p-0">
            <Input
                label="Usuario Solicitante"
                id="usuario"
                type="text"
                value={formData.usuario}
                onChange={handleChange}
                error={errors.usuario}
                required
                disabled={isLoading}
            />
            <Input
                label="Equipo Solicitado"
                id="equipo"
                type="text"
                value={formData.equipo}
                onChange={handleChange}
                error={errors.equipo}
                required
                disabled={isLoading}
            />
            <Input
                label="Motivo de la Solicitud"
                id="motivo"
                type="text"
                value={formData.motivo}
                onChange={handleChange}
                error={errors.motivo}
                required
                disabled={isLoading}
            />
            <div>
                <label htmlFor="estado" className="block text-gray-700 text-sm font-semibold mb-2">Estado</label>
                <select
                    id="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    disabled={isLoading || modalType === 'add'} // El estado solo se puede cambiar en edición
                    className="border border-gray-300 rounded-lg w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aprobada">Aprobada</option>
                    <option value="Rechazada">Rechazada</option>
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

export default SolicitudForm;
