import React, { useState } from 'react';
import logo from '../assets/LOGO TESA.png';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(usuario, contraseña);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 z-50">
      <div className="bg-white rounded-2xl shadow-2xl px-12 py-10 w-full max-w-lg flex flex-col items-center border border-gray-200">
        <img src={logo} alt="Logo de TESA" className="w-28 mb-8" />
        <h1 className="text-3xl font-extrabold text-primary mb-2 text-center tracking-wide">GESTIÓN DE INVENTARIO TESA</h1>
        <p className="text-gray-700 mb-8 text-center text-lg">Sistema de Inventario Tecnológico</p>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-800 mb-1 font-semibold">Usuario</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-100 text-lg"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-800 mb-1 font-semibold">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-100 text-lg"
              value={contraseña}
              onChange={e => setContraseña(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-600 mb-4 text-base text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-accent text-white font-bold py-3 rounded-lg text-lg transition-colors duration-200 shadow-md"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
} 