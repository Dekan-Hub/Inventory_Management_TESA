import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Layout from './layout/Layout';
// Importar páginas principales (crear archivos después)
import DashboardPage from './pages/DashboardPage';
import EquiposPage from './pages/EquiposPage';
import MantenimientosPage from './pages/MantenimientosPage';
import SolicitudesPage from './pages/SolicitudesPage';
import ReportesPage from './pages/ReportesPage';
import ConfiguracionPage from './pages/ConfiguracionPage';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  const [user, setUser] = useState({ nombre: 'Usuario Demo' });
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  const handleConfig = () => {
    window.location.href = '/configuracion';
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout user={user} onLogout={handleLogout} onConfig={handleConfig}>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/equipos" element={<EquiposPage />} />
                  <Route path="/mantenimientos" element={<MantenimientosPage />} />
                  <Route path="/solicitudes" element={<SolicitudesPage />} />
                  <Route path="/reportes" element={<ReportesPage />} />
                  <Route path="/configuracion" element={<ConfiguracionPage />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
