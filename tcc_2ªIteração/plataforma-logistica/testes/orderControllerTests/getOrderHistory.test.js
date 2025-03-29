const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');

jest.mock('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/models', () => ({
  Order: {
    findAll: jest.fn()
  },
  Payment: {
    findOne: jest.fn()
  },
  PostOffice: {
    findOne: jest.fn()
  },
  OrderType: {
    findOne: jest.fn()
  },
  DeliveryType: {
    findOne: jest.fn()
  },
  Recipient: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  User: {
    findByPk: jest.fn(),
    findOne: jest.fn()
  },
  OrderRecipient: {
    create: jest.fn()
  },
  UserRoles: {
    findOne: jest.fn()
  },
  PostOfficeUser: {
    findByPk: jest.fn()
  }
}));
jest.mock('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/src/services/emailService.js', () => ({
  sendOrderStatusNotification: jest.fn()
}));

const { Order, User, UserRoles } = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/models');

describe('GET /api/orders', () => {
  let token, decodedToken;
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'defaultSecret';
    process.env.JWT_Secret = 'defaultSecret';
    
    token = jwt.sign({ user_id: 1, nif: '123456789' }, process.env.JWT_SECRET);
    decodedToken = { user_id: 1, nif: '123456789' };
    
    User.findByPk.mockResolvedValue({ user_id: 1, nif: '123456789' });
    UserRoles.findOne.mockResolvedValue({ user_id: 1, user_type: 'user' });
    
    jest.spyOn(jwt, 'verify').mockReturnValue(decodedToken);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  it('deve retornar 401 se o token não for fornecido', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token não fornecido');
  });
  
  it('deve retornar 403 se o token não possuir o campo nif', async () => {
    jest.spyOn(jwt, 'verify')
      .mockReturnValueOnce({ user_id: 1, nif: '123456789' })
      .mockReturnValueOnce({ user_id: 1 }); 
    
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Acesso negado. Apenas usuários comuns podem consultar o histórico.');
  });
  
  it('deve retornar 404 se o usuário não for encontrado', async () => {
    User.findOne.mockResolvedValue(null);
    
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Usuário não encontrado');
  });
  
  it('deve retornar 200 e o histórico de encomendas se tudo ocorrer bem', async () => {
    User.findOne.mockResolvedValue({ user_id: 1, nif: '123456789' });
    const ordersMock = [
      {
        description: 'Pedido Teste',
        Recipients: [{ name: 'João', surname: 'Silva' }]
      }
    ];
    Order.findAll.mockResolvedValue(ordersMock);
    
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Histórico de encomendas recuperado com sucesso!');
    expect(res.body.orders).toEqual(ordersMock);
  });
  
  it('deve retornar 500 em caso de erro inesperado', async () => {
    User.findOne.mockRejectedValue(new Error('Erro no servidor'));
    
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Erro ao recuperar histórico de encomendas.');
  });
});
