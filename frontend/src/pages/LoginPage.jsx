import React, { useState } from 'react';
import logo from '../assets/tesa logo circular (2).png';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      // Guardar token y redirigir
      localStorage.setItem('token', res.data.token);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-accent to-dark">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <img src={logo} alt="Logo TESA" className="w-32 mb-6" />
        <h1 className="text-2xl font-bold text-primary mb-2">Bienvenido a TESA</h1>
        <p className="text-dark mb-6 text-center">Sistema de Inventario Tecnológico</p>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-dark mb-1">Correo electrónico</label>
            <input
              type="email"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-dark mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-accent text-white font-bold py-2 rounded transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
} 