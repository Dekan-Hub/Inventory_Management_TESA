// Importa React para poder usar JSX y las funcionalidades de React.
import React from 'react';
// Importa ReactDOM para interactuar con el DOM del navegador y renderizar componentes React.
import ReactDOM from 'react-dom/client';
// Importa el componente principal de la aplicación.
import App from './App.jsx';
// Importa los estilos globales de la aplicación, incluyendo las directivas de Tailwind CSS.
import './index.css';
// Importa el AuthProvider desde el contexto de autenticación.
import { AuthProvider } from './context/AuthContext.jsx';

// Crea una raíz de React usando el elemento con id 'root' del index.html.
// Este es el punto de entrada principal donde toda la aplicación React será montada.
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode es una herramienta para detectar problemas potenciales en una aplicación.
  // Activa comprobaciones adicionales y advertencias durante el desarrollo.
  <React.StrictMode>
    {/* Envuelve toda la aplicación con AuthProvider.
        Esto hace que el contexto de autenticación (isAuthenticated, user, login, logout, etc.)
        esté disponible para cualquier componente descendiente en el árbol de componentes,
        sin necesidad de pasar props manualmente en cada nivel. */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
