const request = require('supertest');
const app = require('../../server');
const { Equipo, TipoEquipo, EstadoEquipo, Ubicacion } = require('../../models');

describe('Equipos Controller', () => {
  let testEquipo;
  let authToken;

  beforeAll(async () => {
    // Crear datos de prueba
    const tipoEquipo = await TipoEquipo.create({
      nombre: 'Test Tipo',
      descripcion: 'Tipo de prueba'
    });

    const estadoEquipo = await EstadoEquipo.create({
      nombre: 'Test Estado',
      color: '#000000',
      descripcion: 'Estado de prueba'
    });

    const ubicacion = await Ubicacion.create({
      nombre: 'Test Ubicacion',
      descripcion: 'Ubicación de prueba'
    });

    testEquipo = {
      codigo: 'TEST001',
      nombre: 'Equipo de Prueba',
      marca: 'Test Brand',
      modelo: 'Test Model',
      tipo_equipo_id: tipoEquipo.id,
      estado_equipo_id: estadoEquipo.id,
      ubicacion_id: ubicacion.id,
      fecha_adquisicion: new Date(),
      valor_adquisicion: 1000.00
    };
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    await Equipo.destroy({ where: {} });
    await TipoEquipo.destroy({ where: {} });
    await EstadoEquipo.destroy({ where: {} });
    await Ubicacion.destroy({ where: {} });
  });

  describe('GET /api/equipos', () => {
    it('should return list of equipos with pagination', async () => {
      const response = await request(app)
        .get('/api/equipos')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
    });

    it('should filter equipos by search term', async () => {
      const response = await request(app)
        .get('/api/equipos?search=test')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/equipos', () => {
    it('should create a new equipo', async () => {
      const response = await request(app)
        .post('/api/equipos')
        .send(testEquipo)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.codigo).toBe(testEquipo.codigo);
    });

    it('should validate required fields', async () => {
      const invalidEquipo = {
        nombre: 'Test'
        // Faltan campos requeridos
      };

      const response = await request(app)
        .post('/api/equipos')
        .send(invalidEquipo)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/equipos/:id', () => {
    it('should return equipo by id', async () => {
      const equipo = await Equipo.create(testEquipo);

      const response = await request(app)
        .get(`/api/equipos/${equipo.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(equipo.id);

      await equipo.destroy();
    });

    it('should return 404 for non-existent equipo', async () => {
      const response = await request(app)
        .get('/api/equipos/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/equipos/:id', () => {
    it('should update equipo', async () => {
      const equipo = await Equipo.create(testEquipo);
      const updateData = { nombre: 'Equipo Actualizado' };

      const response = await request(app)
        .put(`/api/equipos/${equipo.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nombre).toBe(updateData.nombre);

      await equipo.destroy();
    });
  });

  describe('DELETE /api/equipos/:id', () => {
    it('should delete equipo', async () => {
      const equipo = await Equipo.create(testEquipo);

      const response = await request(app)
        .delete(`/api/equipos/${equipo.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verificar que fue eliminado
      const deletedEquipo = await Equipo.findByPk(equipo.id);
      expect(deletedEquipo).toBeNull();
    });
  });
}); 