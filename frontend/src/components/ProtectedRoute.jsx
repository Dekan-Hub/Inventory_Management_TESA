import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ROLES_VALIDOS = ['administrador', 'tecnico', 'usuario'];

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  // Log para depuración
  console.log('Usuario autenticado:', user);
  if (!user.rol || !ROLES_VALIDOS.includes(user.rol)) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error de rol</h2>
        <p className="text-lg text-gray-700 mb-4">Tu usuario no tiene un rol válido asignado. Contacta al administrador.</p>
        <a href="/" className="text-primary underline">Volver al inicio</a>
      </div>
    );
  }
  if (roles && !roles.includes(user.rol)) return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso denegado</h2>
      <p className="text-lg text-gray-700 mb-4">No tienes permisos para ver esta sección.</p>
      <a href="/" className="text-primary underline">Volver al inicio</a>
    </div>
  );
  return children;
} 