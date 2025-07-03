const { Usuario } = require('../models');
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
        where.$or = [
          { nombre: { $like: `%${search}%` } },
          { apellido: { $like: `%${search}%` } },
          { email: { $like: `%${search}%` } }
        ];
      }
      const usuarios = await Usuario.findAndCountAll({
        where,
        attributes: { exclude: ['password'] },
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
        attributes: { exclude: ['password'] }
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
      const { nombre, apellido, email, password, rol = 'usuario', activo = true } = req.body;
      // Verificar si el email ya existe
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({ success: false, message: 'El email ya está registrado' });
      }
      // Encriptar contraseña
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const usuario = await Usuario.create({
        nombre,
        apellido,
        email,
        password: hashedPassword,
        rol,
        activo
      });
      const { password: _, ...usuarioSinPassword } = usuario.toJSON();
      logger.info(`Usuario creado: ID ${usuario.id}`);
      res.status(201).json({ success: true, message: 'Usuario creado exitosamente', data: usuarioSinPassword });
    } catch (error) {
      logger.error('Error al crear usuario:', error);
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nombre, apellido, email, password, rol, activo } = req.body;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      // Solo admin puede actualizar roles
      if (rol && req.user.rol !== 'admin') {
        return res.status(403).json({ success: false, message: 'Solo los administradores pueden cambiar roles' });
      }
      // Verificar email único si se está cambiando
      if (email && email !== usuario.email) {
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
          return res.status(400).json({ success: false, message: 'El email ya está registrado' });
        }
      }
      const updateData = { nombre, apellido, email, rol, activo };
      // Encriptar nueva contraseña si se proporciona
      if (password) {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        updateData.password = await bcrypt.hash(password, saltRounds);
      }
      await usuario.update(updateData);
      const { password: _, ...usuarioSinPassword } = usuario.toJSON();
      logger.info(`Usuario actualizado: ID ${id}`);
      res.json({ success: true, message: 'Usuario actualizado exitosamente', data: usuarioSinPassword });
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
        attributes: { exclude: ['password'] }
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
      const { nombre, apellido, email, password } = req.body;
      const usuario = await Usuario.findByPk(req.user.id);
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      // Verificar email único si se está cambiando
      if (email && email !== usuario.email) {
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
          return res.status(400).json({ success: false, message: 'El email ya está registrado' });
        }
      }
      const updateData = { nombre, apellido, email };
      // Encriptar nueva contraseña si se proporciona
      if (password) {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        updateData.password = await bcrypt.hash(password, saltRounds);
      }
      await usuario.update(updateData);
      const { password: _, ...usuarioSinPassword } = usuario.toJSON();
      logger.info(`Perfil actualizado: ID ${req.user.id}`);
      res.json({ success: true, message: 'Perfil actualizado exitosamente', data: usuarioSinPassword });
    } catch (error) {
      logger.error('Error al actualizar perfil:', error);
      next(error);
    }
  }
}

module.exports = new UsuariosController(); 