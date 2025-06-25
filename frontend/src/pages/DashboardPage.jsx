// Importa React y hooks como useState, useEffect, useCallback.
import React, { useState, useEffect, useCallback } from 'react';
// Importa el servicio para obtener los datos del dashboard.
import { getDashboardData } from '../services/dashboardService';
// Importa los componentes reutilizables Card y ModalMessage.
import Card from '../components/Card';
import ModalMessage from '../components/ModalMessage';

/**
 * DashboardPage: Componente de la página principal del dashboard.
 * Muestra un resumen de las métricas clave del inventario y la actividad reciente.
 */
const DashboardPage = () => {
    // Estado para almacenar los datos del dashboard.
    const [dashboardData, setDashboardData] = useState({
        totalProductos: 0,
        movimientos: 0,
        productosBajoStock: 0,
        categorias: 0,
        actividadReciente: [],
        resumenPorCategoria: [] // Datos para el gráfico, si se implementa.
    });
    // Estado para controlar si los datos del dashboard están cargando.
    const [isLoading, setIsLoading] = useState(true);
    // Estado para almacenar mensajes de error (aunque el modalMessage lo maneja mejor).
    const [error, setError] = useState(null);
    // Estados para el ModalMessage global.
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    /**
     * `fetchDashboardData`: Función para obtener los datos del dashboard.
     * Utiliza `useCallback` para memorizar la función.
     */
    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true); // Activa el estado de carga.
        setError(null); // Limpia cualquier error previo.
        try {
            const data = await getDashboardData(); // Llama al servicio API.
            setDashboardData(data); // Actualiza el estado con los datos recibidos.
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message); // Almacena el error.
            setMessage(`Error al cargar datos del dashboard: ${err.message}`); // Establece mensaje para el modal.
            setMessageType('error'); // Tipo de mensaje de error.
        } finally {
            setIsLoading(false); // Desactiva el estado de carga al finalizar.
        }
    }, []); // Dependencias vacías: la función se memoriza.

    // `useEffect` para llamar a `fetchDashboardData` cuando el componente se monta.
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]); // Se re-ejecuta si `fetchDashboardData` cambia (no debería con useCallback).

    // Función para cerrar el modal de mensaje.
    const handleCloseMessage = () => {
        setMessage('');
        setMessageType('');
    };

    // Muestra un mensaje de carga mientras los datos están siendo obtenidos.
    if (isLoading) return <div className="p-6 text-center text-gray-600">Cargando dashboard...</div>;

    return (
        // Contenedor principal de la página del dashboard.
        <div className="p-6 bg-gray-50 flex-1 overflow-y-auto rounded-lg font-inter">
            {/* Título de la página. */}
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>

            {/* Sección de Tarjetas de Estadísticas. */}
            {/* Grid de 4 columnas en desktop, 2 en tablet y 1 en móvil. */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Componentes Card para mostrar métricas clave. */}
                <Card stat={{ label: 'Total de Productos', value: dashboardData.totalProductos, icon: '📦' }} />
                <Card stat={{ label: 'Movimientos', value: dashboardData.movimientos, icon: '🚚' }} />
                <Card stat={{ label: 'Productos con bajo stock', value: dashboardData.productosBajoStock, icon: '⚠️', highlight: true }} />
                <Card stat={{ label: 'Categorías', value: dashboardData.categorias, icon: '🏷️' }} />
            </div>

            {/* Sección de Resumen de Inventario por Categoría (Gráfico) y Actividad Reciente. */}
            {/* Grid de 3 columnas en desktop, con la primera columna ocupando 2/3 y la segunda 1/3. */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Contenedor para el gráfico. Ocupa 2 columnas en pantallas grandes. */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Inventario por Categoría</h3>
                    {/* Placeholder para la integración futura de una librería de gráficos (ej. Recharts). */}
                    <div className="w-full h-72 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 border border-gray-200">
                        <p>Gráfico de Barras (Datos de Backend)</p>
                    </div>
                </div>
                {/* Contenedor para la actividad reciente. Ocupa 1 columna en pantallas grandes. */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
                    <ul className="space-y-3">
                        {/* Renderiza la lista de actividad reciente si hay datos, de lo contrario muestra un mensaje. */}
                        {dashboardData.actividadReciente && dashboardData.actividadReciente.length > 0 ? (
                            dashboardData.actividadReciente.map((activity, index) => (
                                <li key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                                    <p className="text-gray-800 font-medium">{activity.type}</p>
                                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                                        <span>{activity.user}</span>
                                        <span>{new Date(activity.date).toLocaleString()}</span>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">No hay actividad reciente.</p>
                        )}
                    </ul>
                </div>
            </div>

            {/* Modal para mensajes globales (éxito, error, etc.). */}
            {message && (
                <ModalMessage
                    message={message}
                    type={messageType}
                    onClose={handleCloseMessage}
                />
            )}
        </div>
    );
};

export default DashboardPage;
