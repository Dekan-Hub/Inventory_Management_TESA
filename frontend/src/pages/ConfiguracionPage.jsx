import React, { useState } from 'react';
import UsuariosList from './Usuarios/UsuariosList';
import { useAuth } from '../context/AuthContext';

const tabs = [
  { label: 'General', key: 'general' },
  { label: 'Usuarios', key: 'usuarios' },
];

export default function ConfiguracionPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('general');
  if (user?.rol !== 'administrador') {
    return <div className="p-6">Acceso restringido. Solo el administrador puede ver esta sección.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">Configuración</h1>
      <div className="bg-white rounded shadow p-6">
        <div className="flex gap-4 border-b mb-4">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`pb-2 px-4 font-semibold border-b-2 transition-colors duration-200 ${tab === t.key ? 'border-primary text-primary' : 'border-transparent text-dark'}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'general' && (
          <div>
            <h2 className="font-bold mb-2">Configuración General</h2>
            <form className="space-y-4 max-w-lg">
              <div>
                <label className="block text-dark mb-1">Nombre de la institución</label>
                <input className="w-full border rounded px-3 py-2" defaultValue="Tecnológico San Antonio" />
              </div>
              <div>
                <label className="block text-dark mb-1">Dirección</label>
                <input className="w-full border rounded px-3 py-2" defaultValue="Av. Principal #123, Ciudad" />
              </div>
              <div>
                <label className="block text-dark mb-1">Correo de contacto</label>
                <input className="w-full border rounded px-3 py-2" defaultValue="contacto@instituto.edu" />
              </div>
              <div>
                <label className="block text-dark mb-1">Teléfono</label>
                <input className="w-full border rounded px-3 py-2" defaultValue="(123) 456-7890" />
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded font-bold mt-2 hover:bg-accent transition-colors">Guardar cambios</button>
            </form>
          </div>
        )}
        {tab === 'usuarios' && (
          <div>
            <h2 className="font-bold mb-2">Gestión de Usuarios</h2>
            <UsuariosList />
          </div>
        )}
      </div>
    </div>
  );
} 