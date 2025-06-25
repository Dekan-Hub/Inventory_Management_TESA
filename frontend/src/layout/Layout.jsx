import React from 'react';
import Header from '../components/Header'; // Importa el componente Header.
import Sidebar from '../components/Sidebar'; // Importa el componente Sidebar.

/**
 * Layout: Componente de diseño principal de la aplicación.
 * Define la estructura de la página, incluyendo el Sidebar a la izquierda,
 * el Header en la parte superior derecha y el área de contenido principal.
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes hijos que se renderizarán en el área de contenido principal.
 * @param {object} props.user - Objeto con la información del usuario, pasado al Header.
 * @param {function} props.onNavigate - Función de navegación, pasada al Sidebar y opcionalmente al Header.
 * @param {string} props.currentView - La vista actual, pasada al Sidebar y opcionalmente al Header.
 */
const Layout = ({ children, user, onNavigate, currentView }) => {
  return (
    // Contenedor principal de la aplicación.
    // Utiliza flexbox para organizar el Sidebar y el contenido principal.
    // `h-screen` asegura que ocupe toda la altura de la ventana.
    <div className="flex h-screen bg-gray-100 font-inter antialiased">
      {/* Sidebar: Barra lateral de navegación. */}
      {/* Recibe `onNavigate` para manejar los cambios de vista y `currentView` para resaltar el elemento activo. */}
      <Sidebar onNavigate={onNavigate} currentView={currentView} />

      {/* Contenedor principal del contenido de la derecha (Header + Área de contenido). */}
      {/* Ocupa el espacio restante (`flex-1`) y se organiza verticalmente (`flex-col`). */}
      <div className="flex-1 flex flex-col">
        {/* Header: Encabezado superior. */}
        {/* Recibe `user` para mostrar la información del usuario. `onNavigate` y `currentView` también pueden pasarse si el Header necesita lógica de navegación interna. */}
        <Header user={user} onNavigate={onNavigate} currentView={currentView} />

        {/* Área de contenido principal. */}
        {/* Ocupa el espacio restante verticalmente (`flex-1`), permite el desplazamiento (`overflow-hidden` para que el scroll sea interno en caso de desbordamiento de su contenido), padding y bordes redondeados. */}
        <main className="flex-1 overflow-hidden p-6">
          {/* `children` es donde se renderizarán los componentes de página específicos (Dashboard, Productos, etc.). */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
