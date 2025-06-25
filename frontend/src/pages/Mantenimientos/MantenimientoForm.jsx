import React, { useState, useEffect, useContext } from 'react';
import { createMantenimiento, updateMantenimiento } from '../../services/mantenimientosService';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Form from '../../components/Form';
import { AuthContext } from '../../context/AuthContext';

/**
 * MantenimientoForm: Componente de formulario para crear o editar un registro de mantenimiento.
 * @param {object} props - Propiedades del componente.
 * @param {object} [props.mantenimiento] - Objeto de mantenimiento actual (para editar) o inicial vacío (para agregar).
 * @param {string} props.modalType - Tipo de operación ('add' o 'edit').
 * @param {function} props.onSave - Callback al guardar el mantenimiento.
 * @param {function} props.onCancel - Callback al cancelar.
 */
const MantenimientoForm = ({ mantenimiento, modalType, onSave, onCancel }) => {
    const [formData, setFormData] = useState(mantenimiento || {
        equipo: '',
        fecha: new Date().toISOString().split('T')[0], // Fecha actual por defecto
        tipo: 'Preventivo',
        descripcion: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { setGlobalMessage } = useContext(AuthContext);

    useEffect(() => {
        setFormData(mantenimiento || {
            equipo: '',
            fecha: new Date().toISOString().split('T')[0],
            tipo: 'Preventivo',
            descripcion: ''
        });
        setErrors({});
    }, [mantenimiento, modalType]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.equipo) newErrors.equipo = 'El nombre del equipo es requerido.';
        if (!formData.fecha) newErrors.fecha = 'La fecha es requerida.';
        if (!formData.tipo) newErrors.tipo = 'El tipo de mantenimiento es requerido.';
        if (!formData.descripcion) newErrors.descripcion = 'La descripción es requerida.';
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
                await createMantenimiento(formData);
                onSave(true, 'Mantenimiento registrado exitosamente.');
            } else {
                await updateMantenimiento(formData._id, formData);
                onSave(true, 'Mantenimiento actualizado exitosamente.');
            }
        } catch (error) {
            console.error('Error saving mantenimiento:', error);
            const apiErrorMessage = error.response?.data?.message || error.message || 'Error desconocido';
            setGlobalMessage({ message: `Error al guardar mantenimiento: ${apiErrorMessage}`, type: 'error' });
            onSave(false, `Error al guardar mantenimiento: ${apiErrorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} disabled={isLoading} className="shadow-none p-0">
            <Input
                label="Equipo"
                id="equipo"
                type="text"
                value={formData.equipo}
                onChange={handleChange}
                error={errors.equipo}
                required
                disabled={isLoading}
            />
            <Input
                label="Fecha de Mantenimiento"
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
                error={errors.fecha}
                required
                disabled={isLoading}
            />
            <div>
                <label htmlFor="tipo" className="block text-gray-700 text-sm font-semibold mb-2">Tipo de Mantenimiento</label>
                <select
                    id="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="border border-gray-300 rounded-lg w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="Preventivo">Preventivo</option>
                    <option value="Correctivo">Correctivo</option>
                    <option value="Predictivo">Predictivo</option>
                </select>
            </div>
            <Input
                label="Descripción"
                id="descripcion"
                type="textarea" // Aunque Input es de texto, se puede estilizar como textarea
                value={formData.descripcion}
                onChange={handleChange}
                error={errors.descripcion}
                required
                disabled={isLoading}
            />

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

export default MantenimientoForm;
