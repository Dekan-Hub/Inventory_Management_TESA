import React from 'react';
import { createRoot } from 'react-dom/client';
import AppWrapper from './AppWrapper'; // Importa el AppWrapper que contiene los proveedores

// Obtiene el elemento raíz del DOM
const container = document.getElementById('root');
const root = createRoot(container);

// Renderiza el componente principal de la aplicación
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
