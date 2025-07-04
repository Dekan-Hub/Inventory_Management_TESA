import React, { useState, useEffect } from 'react';
import { getAdjuntosBySolicitud, uploadAdjunto, downloadAdjunto, deleteAdjunto } from '../services/adjuntosService';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function AdjuntosList({ solicitudId, onAdjuntoChange }) {
  const { user } = useAuth();
  const [adjuntos, setAdjuntos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (solicitudId) {
      fetchAdjuntos();
    }
  }, [solicitudId]);

  const fetchAdjuntos = async () => {
    setLoading(true);
    try {
      const data = await getAdjuntosBySolicitud(solicitudId);
      setAdjuntos(data);
    } catch (error) {
      console.error('Error al cargar adjuntos:', error);
      setError('Error al cargar los adjuntos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Máximo 10MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Selecciona un archivo para subir');
      return;
    }

    setUploading(true);
    setError('');
    
    try {
      await uploadAdjunto(solicitudId, selectedFile, descripcion);
      setSelectedFile(null);
      setDescripcion('');
      fetchAdjuntos();
      if (onAdjuntoChange) onAdjuntoChange();
    } catch (error) {
      console.error('Error al subir archivo:', error);
      setError(error.response?.data?.message || 'Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (adjunto) => {
    try {
      await downloadAdjunto(adjunto.id);
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      setError('Error al descargar el archivo');
    }
  };

  const handleDelete = async (adjunto) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
      return;
    }

    try {
      await deleteAdjunto(adjunto.id);
      fetchAdjuntos();
      if (onAdjuntoChange) onAdjuntoChange();
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      setError('Error al eliminar el archivo');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (tipoArchivo) => {
    if (tipoArchivo.startsWith('image/')) return '🖼️';
    if (tipoArchivo.includes('pdf')) return '📄';
    if (tipoArchivo.includes('word')) return '📝';
    if (tipoArchivo.includes('excel')) return '📊';
    if (tipoArchivo.includes('text')) return '📄';
    return '📎';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Archivos Adjuntos</h3>
      
      {error && (
        <div className="text-red-600 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Formulario de subida */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium mb-3">Subir nuevo archivo</h4>
        <div className="space-y-3">
          <div>
            <input
              type="file"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Descripción del archivo (opcional)"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <Button 
            onClick={handleUpload} 
            loading={uploading}
            disabled={!selectedFile}
            className="w-full"
          >
            Subir Archivo
          </Button>
        </div>
      </div>

      {/* Lista de adjuntos */}
      {loading ? (
        <div className="text-center py-4">Cargando adjuntos...</div>
      ) : adjuntos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay archivos adjuntos
        </div>
      ) : (
        <div className="space-y-2">
          {adjuntos.map((adjunto) => (
            <div key={adjunto.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getFileIcon(adjunto.tipo_archivo)}</span>
                <div>
                  <div className="font-medium">{adjunto.nombre_archivo}</div>
                  <div className="text-sm text-gray-500">
                    {formatFileSize(adjunto.tamano_bytes)} • 
                    {adjunto.usuario?.nombre} • 
                    {new Date(adjunto.fecha_subida).toLocaleDateString()}
                  </div>
                  {adjunto.descripcion && (
                    <div className="text-sm text-gray-600 mt-1">
                      {adjunto.descripcion}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(adjunto)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Descargar
                </button>
                {(user?.rol === 'administrador' || adjunto.usuario_id === user?.id) && (
                  <button
                    onClick={() => handleDelete(adjunto)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 