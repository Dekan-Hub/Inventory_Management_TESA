import React from 'react';

// El componente Content es un simple contenedor visual para el contenido principal.
// NO debe contener lógica de ruteo ni importar páginas directamente.
const Content = ({ children, className = '', ...props }) => {
  return (
    <main className={`flex-grow p-6 bg-gray-50 ${className}`} {...props}>
      {children} {/* Aquí se renderizará el contenido de la página actual que le pase App.jsx */}
    </main>
  );
};

export default Content;
