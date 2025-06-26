import React from 'react';
import App from './App'; // El componente principal de la aplicación
import { AuthProvider } from './context/AuthContext'; // Proveedor de autenticación
import { AppStateProvider } from './context/AppContext'; // Proveedor del estado global de la app

/**
 * AppWrapper: Envuelve la aplicación principal con los proveedores de contexto necesarios.
 * Esto asegura que los contextos de autenticación y estado global estén disponibles
 * para todos los componentes hijos.
 */
export default function AppWrapper() {
  return (
    <AppStateProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AppStateProvider>
  );
}
