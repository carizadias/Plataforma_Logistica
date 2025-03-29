const request = require('supertest');
const app = require('../../app'); 
const { Service, PostOfficeUser } = require('../../models');
const jwt = require('jsonwebtoken');

jest.mock('../../models', () => ({
  Service: {
    create: jest.fn(),
  },
  PostOfficeUser: {
    findByPk: jest.fn(),
  },
}));

describe('POST /api/post_offices/services', () => {
  let token;
  let adminUser;
  let nonAdminUser;

  beforeEach(() => {
    jest.clearAllMocks();
    token = jwt.sign({ id: 1, user_id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });

    adminUser = {
      id: 1,
      is_active: true,
      getRoles: jest.fn().mockResolvedValue([{ name: 'admin' }]),
    };

    nonAdminUser = {
      id: 2,
      is_active: true,
      getRoles: jest.fn().mockResolvedValue([{ name: 'user' }]),
    };
  });

  it('deve retornar 401 se o token não for fornecido', async () => {
    const res = await request(app)
      .post('/api/post_offices/services')
      .send({ name: "Entrega Expressa", description: "Entrega rápida em até 24 horas" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token não fornecido');
  });

  it('deve retornar 403 se o usuário não for admin', async () => {
    const invalidToken = jwt.sign({ id: 2, user_id: 2 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    PostOfficeUser.findByPk.mockResolvedValue(nonAdminUser);

    const res = await request(app)
      .post('/api/post_offices/services')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({ name: "Entrega Expressa", description: "Entrega rápida" });

    expect(res.status).toBe(403);
    expect(res.body.message).toContain('Acesso negado');
  });

  it('deve retornar 400 se nome ou descrição estiverem ausentes', async () => {
    PostOfficeUser.findByPk.mockResolvedValue(adminUser);

    const res = await request(app)
      .post('/api/post_offices/services')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: "", description: "" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Nome e descrição são obrigatórios.");
  });

  it('deve criar um novo serviço com sucesso', async () => {
    PostOfficeUser.findByPk.mockResolvedValue(adminUser);
    const fakeService = { id: 1, name: "Entrega Expressa", description: "Entrega rápida" };
    Service.create.mockResolvedValue(fakeService);

    const res = await request(app)
      .post('/api/post_offices/services')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: "Entrega Expressa", description: "Entrega rápida em até 24 horas" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Serviço adicionado com sucesso!");
    expect(Service.create).toHaveBeenCalledWith({
      name: "Entrega Expressa",
      description: "Entrega rápida em até 24 horas"
    });
  });

  it('deve retornar 500 em caso de erro interno', async () => {
    PostOfficeUser.findByPk.mockResolvedValue(adminUser);
    Service.create.mockRejectedValue(new Error("Erro inesperado"));

    const res = await request(app)
      .post('/api/post_offices/services')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: "Entrega Rápida", description: "Serviço prioritário" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Erro ao adicionar serviço.");
  });
});
