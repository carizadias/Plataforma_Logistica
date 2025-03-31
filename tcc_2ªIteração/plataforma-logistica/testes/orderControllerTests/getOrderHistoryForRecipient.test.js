const request = require('supertest');
const app = require('plataforma-logistica/app.js');
const jwt = require('jsonwebtoken');

jest.mock('plataforma-logistica/models', () => ({
  Order: {
    findAll: jest.fn()
  },
  Recipient: {
    findOne: jest.fn()
  },
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn()
  },
  OrderRecipient: {
    findOne: jest.fn()
  },
  PostOfficeUser: { 
    findByPk: jest.fn()
  },
  UserRoles: { 
    findOne: jest.fn()
  }
}));

const {UserRoles, Order, User } = require('plataforma-logistica/models');

describe('GET /api/orders/recipient', () => {
  let token, decodedToken;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
    
    token = jwt.sign({ user_id: 1, nif: '123456789' }, process.env.JWT_SECRET);
    decodedToken = { user_id: 1, nif: '123456789' };
    
    jest.spyOn(jwt, 'verify').mockReturnValue(decodedToken);
    jest.spyOn(console, 'error').mockImplementation(() => {});

    User.findByPk.mockResolvedValue({ user_id: 1, nif: '123456789' });
    UserRoles.findOne.mockResolvedValue({ user_id: 1, user_type: 'user' });
  });

  it('deve retornar 401 se o token não for fornecido', async () => {
    const res = await request(app).get('/api/orders/recipient');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token não fornecido');
  });

  it('deve retornar 404 se o usuário não for encontrado', async () => {
    User.findOne.mockResolvedValue(null);
    User.findByPk.mockResolvedValue(null);
    
    const res = await request(app)
      .get('/api/orders/recipient')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Usuário não encontrado');
  });

  it('deve retornar 404 se nenhuma encomenda for encontrada', async () => {
    User.findOne.mockResolvedValue({ user_id: 1, nif: '123456789' });
    Order.findAll.mockResolvedValue([]);
    
    const res = await request(app)
      .get('/api/orders/recipient')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Nenhuma encomenda encontrada para este destinatário.');
  });

  it('deve retornar 200 e a lista de encomendas se tudo estiver correto', async () => {
    User.findOne.mockResolvedValue({ user_id: 1, nif: '123456789' });
    const ordersMock = [{ id: 1, description: 'Pedido Teste' }];
    Order.findAll.mockResolvedValue(ordersMock);
    
    const res = await request(app)
      .get('/api/orders/recipient')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Encomendas recuperadas com sucesso!');
    expect(res.body.orders).toEqual(ordersMock);
  });

  it('deve retornar 500 em caso de erro inesperado', async () => {
    User.findOne.mockRejectedValue(new Error('Erro no servidor'));
    
    const res = await request(app)
      .get('/api/orders/recipient')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Erro ao recuperar as encomendas.');
  });
});
