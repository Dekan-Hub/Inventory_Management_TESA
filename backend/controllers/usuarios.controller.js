const { Usuario } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

class UsuariosController {
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        rol,
        activo,
        search
      } = req.query;
      const offset = (page - 1) * limit;
      const where = {};
      if (rol) where.rol = rol;
      if (activo !== undefined) where.activo = activo === 'true';
      if (search) {
        where[Op.or] = [
          { nombre: { [Op.like]: `%${search}%` } },
          { correo: { [Op.like]: `%${search}%` } }
        ];
      }
      const usuarios = await Usuario.findAndCountAll({
        where,
        attributes: { exclude: ['contraseña'] },
        order: [['nombre', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      const totalPages = Math.ceil(usuarios.count / limit);
      logger.info(`Usuarios obtenidos: ${usuarios.rows.length} de ${usuarios.count}`);
      res.json({
        success: true,
        data: usuarios.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: usuarios.count,
          totalPages
        }
      });
    } catch (error) {
      logger.error('Error al obtener usuarios:', error);
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id, {
        attributes: { exclude: ['contraseña'] }
      });
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      logger.info(`Usuario obtenido: ID ${id}`);
      res.json({ success: true, data: usuario });
    } catch (error) {
      logger.error('Error al obtener usuario:', error);
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { nombre, usuario, correo, contraseña, rol = 'usuario', activo = true } = req.body;
      
      // Validar campos requeridos
      if (!nombre || !usuario || !correo || !contraseña) {
        return res.status(400).json({ 
          success: false, 
          message: 'Los campos nombre, usuario, correo y contraseña son requeridos' 
        });
      }

      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.findOne({ 
        where: { 
          [Op.or]: [
            { usuario: usuario },
            { correo: correo }
          ]
        } 
      });
      
      if (usuarioExistente) {
        if (usuarioExistente.usuario === usuario) {
          return res.status(400).json({ 
            success: false, 
            message: 'El nombre de usuario ya está registrado' 
          });
        } else {
          return res.status(400).json({ 
            success: false, 
            message: 'El correo ya está registrado' 
          });
        }
      }

      // Crear el usuario
      const nuevoUsuario = await Usuario.create({
        nombre,
        usuario,
        correo,
        contraseña,
        rol,
        activo
      });

      const { contraseña: _, ...usuarioSinContraseña } = nuevoUsuario.toJSON();
      logger.info(`Usuario creado: ID ${nuevoUsuario.id}`);
      res.status(201).json({ 
        success: true, 
        message: 'Usuario creado exitosamente', 
        data: usuarioSinContraseña 
      });
    } catch (error) {
      logger.error('Error al crear usuario:', error);
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nombre, correo, contraseña, rol, activo } = req.body;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      // Solo admin puede actualizar roles
      if (rol && req.user.rol !== 'admin') {
        return res.status(403).json({ success: false, message: 'Solo los administradores pueden cambiar roles' });
      }
      // Verificar correo único si se está cambiando
      if (correo && correo !== usuario.correo) {
        const usuarioExistente = await Usuario.findOne({ where: { correo } });
        if (usuarioExistente) {
          return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
        }
      }
      const updateData = { nombre, correo, rol, activo };
      // Encriptar nueva contraseña si se proporciona
      if (contraseña) {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        updateData.contraseña = await bcrypt.hash(contraseña, saltRounds);
      }
      await usuario.update(updateData);
      const { contraseña: _, ...usuarioSinContraseña } = usuario.toJSON();
      logger.info(`Usuario actualizado: ID ${id}`);
      res.json({ success: true, message: 'Usuario actualizado exitosamente', data: usuarioSinContraseña });
    } catch (error) {
      logger.error('Error al actualizar usuario:', error);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      // Solo admin puede eliminar usuarios
      if (req.user.rol !== 'admin') {
        return res.status(403).json({ success: false, message: 'Solo los administradores pueden eliminar usuarios' });
      }
      // No permitir eliminar el propio usuario
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({ success: false, message: 'No puedes eliminar tu propia cuenta' });
      }
      await usuario.destroy();
      logger.info(`Usuario eliminado: ID ${id}`);
      res.json({ success: true, message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      logger.error('Error al eliminar usuario:', error);
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const usuario = await Usuario.findByPk(req.user.id, {
        attributes: { exclude: ['contraseña'] }
      });
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      logger.info(`Perfil obtenido: ID ${req.user.id}`);
      res.json({ success: true, data: usuario });
    } catch (error) {
      logger.error('Error al obtener perfil:', error);
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { nombre, correo, contraseña } = req.body;
      const usuario = await Usuario.findByPk(req.user.id);
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      // Verificar correo único si se está cambiando
      if (correo && correo !== usuario.correo) {
        const usuarioExistente = await Usuario.findOne({ where: { correo } });
        if (usuarioExistente) {
          return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
        }
      }
      const updateData = { nombre, correo };
      // Encriptar nueva contraseña si se proporciona
      if (contraseña) {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        updateData.contraseña = await bcrypt.hash(contraseña, saltRounds);
      }
      await usuario.update(updateData);
      const { contraseña: _, ...usuarioSinContraseña } = usuario.toJSON();
      logger.info(`Perfil actualizado: ID ${req.user.id}`);
      res.json({ success: true, message: 'Perfil actualizado exitosamente', data: usuarioSinContraseña });
    } catch (error) {
      logger.error('Error al actualizar perfil:', error);
      next(error);
    }
  }
}

module.exports = new UsuariosController(); 