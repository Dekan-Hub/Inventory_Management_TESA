import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Content from '../components/Content.jsx';
import Header from '../components/Header.jsx'; // Importa el Header

/**
 * Layout: Componente que define la estructura general de la aplicación.
 * Incluye la barra de navegación (Navbar), la barra lateral (Sidebar)
 * y el área de contenido principal (Content).
 */
const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar de navegación */}
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Navbar para información de usuario y logout */}
        <Navbar />

        {/* Área de contenido principal */}
        <Content>
          {children} {/* Aquí se renderizará el contenido de la página actual */}
        </Content>
      </div>
    </div>
  );
};

export default Layout;
