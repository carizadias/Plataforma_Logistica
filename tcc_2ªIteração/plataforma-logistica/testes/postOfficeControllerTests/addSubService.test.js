const request = require('supertest');
const app = require('plataforma-logistica/app.js');
const { SubService, PostOfficeUser } = require('plataforma-logistica/models');
const jwt = require('jsonwebtoken');

jest.mock('plataforma-logistica/models', () => ({
  SubService: {
    create: jest.fn(),
  },
  PostOfficeUser: {
    findByPk: jest.fn(),
  },
}));

describe('POST /api/post_offices/sub_services', () => {
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
      .post('/api/post_offices/sub_services')
      .send({ name: "Rastreamento", description: "Serviço de rastreamento de pacotes" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token não fornecido');
  });

  it('deve retornar 403 se o usuário não for admin', async () => {
    const invalidToken = jwt.sign({ id: 2, user_id: 2 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    PostOfficeUser.findByPk.mockResolvedValue(nonAdminUser);

    const res = await request(app)
      .post('/api/post_offices/sub_services')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({ name: "Rastreamento", description: "Serviço de rastreamento de pacotes" });

    expect(res.status).toBe(403);
    expect(res.body.message).toContain('Acesso negado');
  });

  it('deve retornar 400 se nome ou descrição estiverem ausentes', async () => {
    PostOfficeUser.findByPk.mockResolvedValue(adminUser);

    const res = await request(app)
      .post('/api/post_offices/sub_services')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: "", description: "" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Nome e descrição do subserviço é obrigatório.");
  });

  it('deve criar um novo subserviço com sucesso', async () => {
    PostOfficeUser.findByPk.mockResolvedValue(adminUser);
    const fakeSubService = { id: 1, name: "Rastreamento", description: "Serviço de rastreamento de pacotes" };
    SubService.create.mockResolvedValue(fakeSubService);

    const res = await request(app)
      .post('/api/post_offices/sub_services')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: "Rastreamento", description: "Serviço de rastreamento de pacotes" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Subserviço adicionado com sucesso!");
    expect(SubService.create).toHaveBeenCalledWith({
      name: "Rastreamento",
      description: "Serviço de rastreamento de pacotes"
    });
  });

  it('deve retornar 500 em caso de erro interno', async () => {
    PostOfficeUser.findByPk.mockResolvedValue(adminUser);
    SubService.create.mockRejectedValue(new Error("Erro inesperado"));

    const res = await request(app)
      .post('/api/post_offices/sub_services')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: "Entrega Rápida", description: "Serviço prioritário" });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Erro ao adicionar subserviço.");
  });
});
