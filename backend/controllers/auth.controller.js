/**
 * Controlador para la autenticación de usuarios.
 * Contiene la lógica para el registro (register) y el inicio de sesión (login).
 */
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Registra un nuevo usuario en la base de datos.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.register = async (req, res) => {
  console.log('auth.controller.js: Iniciando función register...'); // <-- NUEVO LOG 1
  try {
    const { nombre, usuario, correo, contraseña, rol } = req.body;
    console.log('auth.controller.js: Datos recibidos para registro:', { usuario, correo }); // <-- NUEVO LOG 2

    const nuevoUsuario = await Usuario.create({
      nombre,
      usuario,
      correo,
      contraseña,
      rol
    });
    console.log('auth.controller.js: Usuario creado en DB.'); // <-- NUEVO LOG 3

    nuevoUsuario.contraseña = undefined;

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      data: nuevoUsuario
    });
    console.log('auth.controller.js: Respuesta de registro enviada.'); // <-- NUEVO LOG 4

  } catch (error) {
    console.error('❌ auth.controller.js: Error en la función register:', error); // <-- LOG MEJORADO
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
  console.log('auth.controller.js: Iniciando función login...'); // <-- NUEVO LOG 5
  try {
    const { usuario, contraseña } = req.body;
    console.log('auth.controller.js: Datos recibidos para login:', { usuario }); // <-- NUEVO LOG 6

    const usuarioEncontrado = await Usuario.findOne({ where: { usuario: usuario } });
    console.log('auth.controller.js: Usuario buscado en DB:', usuarioEncontrado ? 'Encontrado' : 'No encontrado'); // <-- NUEVO LOG 7

    if (!usuarioEncontrado) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas. Verifica tu usuario y contraseña.' });
    }
    console.log('auth.controller.js: Usuario encontrado. Comparando contraseña...'); // <-- NUEVO LOG 8

    const esPasswordCorrecto = await bcrypt.compare(contraseña, usuarioEncontrado.contraseña);
    console.log('auth.controller.js: Contraseña verificada:', esPasswordCorrecto); // <-- NUEVO LOG 9

    if (!esPasswordCorrecto) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas. Verifica tu usuario y contraseña.' });
    }
    console.log('auth.controller.js: Contraseña correcta. Generando JWT...'); // <-- NUEVO LOG 10

    const payload = {
      id: usuarioEncontrado.id,
      rol: usuarioEncontrado.rol
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    console.log('auth.controller.js: JWT generado.'); // <-- NUEVO LOG 11

    usuarioEncontrado.contraseña = undefined;

    res.status(200).json({
      success: true,
      token: token,
      user: {
          id: usuarioEncontrado.id,
          nombre: usuarioEncontrado.nombre,
          correo: usuarioEncontrado.correo,
          rol: usuarioEncontrado.rol
      }
    });
    console.log('auth.controller.js: Respuesta de login enviada.'); // <-- NUEVO LOG 12

  } catch (error) {
    console.error('❌ auth.controller.js: Error en la función login:', error); // <-- LOG MEJORADO
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión.',
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
  try {
    const { usuario, contraseña } = req.body;

    // 1. Buscamos al usuario por su nombre de usuario o correo.
    const usuarioEncontrado = await Usuario.findOne({ where: { usuario: usuario } });

    if (!usuarioEncontrado) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas. Verifica tu usuario y contraseña.' });
    }

    // 2. Comparamos la contraseña proporcionada con la hasheada en la DB.
    const esPasswordCorrecto = await bcrypt.compare(contraseña, usuarioEncontrado.contraseña);

    if (!esPasswordCorrecto) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas. Verifica tu usuario y contraseña.' });
    }

    // 3. Si las credenciales son correctas, creamos el JSON Web Token (JWT).
    const payload = {
      id: usuarioEncontrado.id,
      rol: usuarioEncontrado.rol
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    
    // Ocultamos la contraseña en la respuesta
    usuarioEncontrado.contraseña = undefined;
    
    // 4. Enviamos el token y los datos del usuario como respuesta.
    res.status(200).json({
      success: true,
      token: token,
      user: {
          id: usuarioEncontrado.id,
          nombre: usuarioEncontrado.nombre,
          correo: usuarioEncontrado.correo,
          rol: usuarioEncontrado.rol
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión.',
      error: error.message
    });
  }
};