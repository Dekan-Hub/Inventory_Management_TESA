import api from './api';

export const getAdjuntosBySolicitud = async (solicitudId) => {
  try {
    const res = await api.get(`/adjuntos/solicitud/${solicitudId}`);
    return res.data?.data || [];
  } catch (error) {
    console.error('Error al obtener adjuntos:', error);
    return [];
  }
};

export const uploadAdjunto = async (solicitudId, file, descripcion = '') => {
  try {
    const formData = new FormData();
    formData.append('archivo', file);
    if (descripcion) {
      formData.append('descripcion', descripcion);
    }

    const res = await api.post(`/adjuntos/solicitud/${solicitudId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error al subir adjunto:', error);
    throw error;
  }
};

export const downloadAdjunto = async (adjuntoId) => {
  try {
    const res = await api.get(`/adjuntos/${adjuntoId}/download`, {
      responseType: 'blob',
    });
    
    // Crear URL del blob y descargar
    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = res.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, '') || 'archivo';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('Error al descargar adjunto:', error);
    throw error;
  }
};

export const deleteAdjunto = async (adjuntoId) => {
  try {
    const res = await api.delete(`/adjuntos/${adjuntoId}`);
    return res.data;
  } catch (error) {
    console.error('Error al eliminar adjunto:', error);
    throw error;
  }
}; 