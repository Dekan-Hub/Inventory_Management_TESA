import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Layout from './layout/Layout';
// Importar páginas principales (crear archivos después)
import DashboardPage from './pages/DashboardPage';
import EquiposList from './pages/Equipos/EquiposList';
import MantenimientosList from './pages/Mantenimientos/MantenimientosList';
import MovimientosList from './pages/Movimientos/MovimientosList';
import SolicitudesList from './pages/Solicitudes/SolicitudesList';
import ReportesDashboard from './pages/Reportes/ReportesDashboard';
import ConfiguracionPage from './pages/ConfiguracionPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      {/* Administrador: acceso total */}
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/equipos" element={<ProtectedRoute roles={['administrador', 'tecnico']}><EquiposList /></ProtectedRoute>} />
                      <Route path="/mantenimientos" element={<ProtectedRoute roles={['administrador', 'tecnico']}><MantenimientosList /></ProtectedRoute>} />
                      <Route path="/movimientos" element={<ProtectedRoute roles={['administrador', 'tecnico']}><MovimientosList /></ProtectedRoute>} />
                      <Route path="/solicitudes" element={<ProtectedRoute roles={['administrador', 'tecnico', 'usuario']}><SolicitudesList /></ProtectedRoute>} />
                      <Route path="/reportes" element={<ProtectedRoute roles={['administrador', 'tecnico']}><ReportesDashboard /></ProtectedRoute>} />
                      <Route path="/configuracion" element={<ProtectedRoute roles={['administrador']}><ConfiguracionPage /></ProtectedRoute>} />
                      {/* Redirección para usuarios normales */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
