import React, { useState, useContext } from 'react';
import { generateReport } from '../../services/reportesService';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Form from '../../components/Form';
import Loader from '../../components/Loader';
import { AuthContext } from '../../context/AuthContext';

/**
 * ReportesDashboard: Componente de la página para generar y exportar reportes.
 */
const ReportesDashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [reportType, setReportType] = useState('solicitudes'); // 'solicitudes', 'equipos', 'mantenimientos'
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { setGlobalMessage } = useContext(AuthContext);

    const handleGenerateReport = async (format) => {
        setIsLoading(true);
        try {
            const params = {
                type: reportType,
                startDate,
                endDate,
            };
            const blob = await generateReport(format, params);

            // Crear un URL para el blob y forzar la descarga
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_${reportType}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url); // Liberar el URL del objeto

            setGlobalMessage({ message: `Reporte ${reportType.toUpperCase()} generado exitosamente en formato ${format.toUpperCase()}.`, type: 'success' });

        } catch (error) {
            console.error('Error generating report:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
            setGlobalMessage({ message: `Error al generar el reporte: ${errorMessage}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <Loader fullScreen message="Generando reporte..." />;

    return (
        <div className="p-6 bg-gray-100 flex-1 overflow-y-auto rounded-lg font-inter">
            <Header
                title="Panel de Reportes"
                subtitle="Genera y exporta reportes de los diferentes módulos del sistema."
            />

            <Card title="Generar Nuevo Reporte">
                <Form onSubmit={(e) => e.preventDefault()} className="shadow-none p-0">
                    <div className="mb-4">
                        <label htmlFor="reportType" className="block text-gray-700 text-sm font-semibold mb-2">Tipo de Reporte</label>
                        <select
                            id="reportType"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            disabled={isLoading}
                            className="border border-gray-300 rounded-lg w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="solicitudes">Solicitudes</option>
                            <option value="equipos">Equipos</option>
                            <option value="mantenimientos">Mantenimientos</option>
                        </select>
                    </div>

                    <Input
                        label="Fecha de Inicio (Opcional)"
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        disabled={isLoading}
                    />
                    <Input
                        label="Fecha de Fin (Opcional)"
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        disabled={isLoading}
                    />

                    <div className="flex justify-end space-x-4 mt-8">
                        <Button onClick={() => handleGenerateReport('excel')} isLoading={isLoading} variant="primary">
                            Generar Excel
                        </Button>
                        <Button onClick={() => handleGenerateReport('pdf')} isLoading={isLoading} variant="secondary">
                            Generar PDF
                        </Button>
                    </div>
                </Form>
            </Card>

            <Card title="Reportes Recientes" className="mt-6">
                <p className="text-gray-500">Aquí se mostrará una lista de reportes generados recientemente. (Funcionalidad pendiente)</p>
                {/* Puedes añadir una tabla o lista de reportes generados previamente aquí si el backend lo soporta */}
            </Card>
        </div>
    );
};

export default ReportesDashboard;
