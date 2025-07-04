import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <h1 className="text-5xl font-extrabold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Página no encontrada</h2>
      <p className="mb-6 text-gray-500">La ruta que buscas no existe o no tienes permisos para acceder.</p>
      <Button onClick={() => navigate('/')}>Volver al inicio</Button>
    </div>
  );
} 