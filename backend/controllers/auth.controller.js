/**
 * @file backend/controllers/auth.controller.js
 * @description Controladores para la autenticación de usuarios (registro, login, perfil).
 */

const { Usuario } = require('../models'); // Asegúrate de que esto es correcto y viene de index.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); // Importa dotenv para acceder a las variables de entorno

dotenv.config(); // Carga las variables de entorno

/**
 * Registra un nuevo usuario en la base de datos.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.register = async (req, res) => {
  console.log('auth.controller.js: Iniciando función register...');
  try {
    // Asegúrate de que los nombres de los campos coincidan con tu modelo de Usuario y el frontend.
    // En tu modelo, los campos son: nombre_usuario, correo_electronico, contrasena_hash, rol
    // En tu request, usas: nombre, usuario, correo, contraseña, rol
    // Vamos a unificarlos usando los nombres del modelo para evitar errores de mapeo.
    const { nombre_usuario, correo_electronico, contrasena, rol } = req.body;
    console.log('auth.controller.js: Datos recibidos para registro:', { nombre_usuario, correo_electronico });

    // 1. Verificar si el usuario ya existe por nombre_usuario o correo_electronico
    let usuarioExistente = await Usuario.findOne({
      where: {
        // Importa Op de Sequelize para usar operadores lógicos como OR
        [require('sequelize').Op.or]: [
          { nombre_usuario: nombre_usuario },
          { correo_electronico: correo_electronico }
        ]
      }
    });

    if (usuarioExistente) {
      return res.status(400).json({ success: false, message: 'El nombre de usuario o correo electrónico ya están registrados.' });
    }

    // 2. Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasena_hash = await bcrypt.hash(contrasena, salt); // Hasheamos la contraseña recibida

    // 3. Crear el nuevo usuario en la base de datos
    const nuevoUsuario = await Usuario.create({
      nombre_usuario, // Mapea nombre_usuario
      correo_electronico, // Mapea correo_electronico
      contrasena_hash, // Guarda el hash de la contraseña
      rol: rol || 'empleado', // Si no se especifica rol, por defecto 'empleado'
      estado_activo: true, // Por defecto, el usuario está activo
      fecha_creacion: new Date() // Establece la fecha de creación
    });
    console.log('auth.controller.js: Usuario creado en DB.');

    // No se debe retornar el hash de la contraseña en la respuesta.
    // Sequelize automáticamente no incluirá campos excluidos si configuras bien las vistas o atributos.
    // Para una eliminación temporal en el objeto de respuesta:
    const usuarioRespuesta = { ...nuevoUsuario.toJSON() };
    delete usuarioRespuesta.contrasena_hash;


    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      data: usuarioRespuesta
    });
    console.log('auth.controller.js: Respuesta de registro enviada.');

  } catch (error) {
    console.error('❌ auth.controller.js: Error en la función register:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar el usuario.',
      error: error.message
    });
  }
};

/**
 * Inicia sesión de un usuario existente.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.login = async (req, res) => {
  console.log('auth.controller.js: Iniciando función login...');
  try {
    // Asegúrate de usar los nombres de campo de tu modelo
    const { nombre_usuario, contrasena } = req.body;
    console.log('auth.controller.js: Datos recibidos para login:', { nombre_usuario });

    // 1. Buscamos al usuario por su nombre de usuario.
    const usuarioEncontrado = await Usuario.findOne({ where: { nombre_usuario: nombre_usuario } });
    console.log('auth.controller.js: Usuario buscado en DB:', usuarioEncontrado ? 'Encontrado' : 'No encontrado');

    if (!usuarioEncontrado) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas. Verifica tu usuario y contraseña.' });
    }
    console.log('auth.controller.js: Usuario encontrado. Comparando contraseña...');

    // 2. Comparamos la contraseña proporcionada con el hash de la DB.
    // Asegúrate de que el campo en el modelo es 'contrasena_hash'
    const esPasswordCorrecto = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena_hash);
    console.log('auth.controller.js: Contraseña verificada:', esPasswordCorrecto);

    if (!esPasswordCorrecto) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas. Verifica tu usuario y contraseña.' });
    }
    console.log('auth.controller.js: Contraseña correcta. Generando JWT...');

    // 3. Si las credenciales son correctas, creamos el JSON Web Token (JWT).
    const payload = {
      id: usuarioEncontrado.id_usuario, // Usa 'id_usuario' como PK en tu modelo
      rol: usuarioEncontrado.rol
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h' // Usa una expiración por defecto si no está en .env
    });
    console.log('auth.controller.js: JWT generado.');

    // Opcional: Actualizar la última conexión del usuario
    usuarioEncontrado.ultima_conexion = new Date();
    await usuarioEncontrado.save();

    // 4. Enviamos el token y los datos del usuario como respuesta.
    // No se debe retornar el hash de la contraseña en la respuesta.
    const userResponse = { ...usuarioEncontrado.toJSON() };
    delete userResponse.contrasena_hash;

    res.status(200).json({
      success: true,
      token: token,
      user: userResponse
    });
    console.log('auth.controller.js: Respuesta de login enviada.');

  } catch (error) {
    console.error('❌ auth.controller.js: Error en la función login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión.',
      error: error.message
    });
  }
};

/**
 * Obtiene los detalles del perfil del usuario autenticado.
 * Este controlador asume que el middleware de autenticación (e.g., 'protect')
 * ya ha verificado el token y adjuntado el objeto 'usuario' al 'req'.
 * @param {object} req - Objeto de solicitud de Express (espera req.usuario del middleware).
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.getProfile = async (req, res) => {
  console.log('auth.controller.js: Iniciando función getProfile...');
  try {
    // req.usuario debería ser establecido por el middleware de autenticación (e.g., 'protect')
    // El middleware debe adjuntar el ID de usuario desde el payload del JWT, por ejemplo req.usuario = { id: payload.id, rol: payload.rol };
    if (!req.usuario || !req.usuario.id) {
      console.warn('auth.controller.js: No se encontró ID de usuario en req.usuario. Esto puede indicar un problema con el middleware de autenticación.');
      return res.status(401).json({ success: false, message: 'Usuario no autenticado o ID de usuario no disponible.' });
    }

    // Buscar el usuario en la base de datos excluyendo la contraseña
    const usuario = await Usuario.findByPk(req.usuario.id, { // Usa req.usuario.id, que debería ser el id_usuario
      attributes: { exclude: ['contrasena_hash'] } // Excluye el hash de la contraseña
    });
    console.log('auth.controller.js: Perfil de usuario buscado:', usuario ? 'Encontrado' : 'No encontrado');

    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    res.status(200).json({
      success: true,
      message: 'Perfil de usuario obtenido exitosamente.',
      user: usuario
    });
    console.log('auth.controller.js: Respuesta de perfil enviada.');

  } catch (error) {
    console.error('❌ auth.controller.js: Error en la función getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil del usuario.',
      error: error.message
    });
  }
};