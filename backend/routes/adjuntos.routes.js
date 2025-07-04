/**
 * @file Rutas de Adjuntos
 * @description Define las rutas para manejar archivos adjuntos de solicitudes
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const adjuntosController = require('../controllers/adjuntos.controller');
const { verifyToken, checkRole } = require('../middleware/auth');

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/adjuntos');
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Obtener adjuntos de una solicitud
router.get('/solicitud/:solicitud_id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), adjuntosController.getAdjuntosBySolicitud);

// Subir adjunto a una solicitud
router.post('/solicitud/:solicitud_id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), upload.single('archivo'), adjuntosController.uploadAdjunto);

// Descargar adjunto
router.get('/:id/download', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), adjuntosController.downloadAdjunto);

// Eliminar adjunto
router.delete('/:id', verifyToken, checkRole(['administrador', 'tecnico', 'usuario']), adjuntosController.deleteAdjunto);

module.exports = router; 