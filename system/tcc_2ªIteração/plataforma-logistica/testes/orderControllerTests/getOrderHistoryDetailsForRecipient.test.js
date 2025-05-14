const request = require('supertest');
const app = require('plataforma-logistica/app.js');
const jwt = require('jsonwebtoken');

jest.mock('plataforma-logistica/models', () => ({
  Order: {
    findOne: jest.fn()
  },
  Recipient: {},
  OrderRecipient: {},
  User: {
    findByPk: jest.fn(),
    findOne: jest.fn()
  },
  UserRoles: {
    findOne: jest.fn()
  },
  PostOfficeUser: {
    findByPk: jest.fn()
  }
}));

const { Order, User, UserRoles } = require('plataforma-logistica/models');

describe('GET /api/orders/recipient_order_details/:order_id', () => {
  let token, decodedToken;
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'defaultSecret';
    process.env.JWT_Secret = 'defaultSecret';
    
    token = jwt.sign({ user_id: 1, nif: '123456789' }, process.env.JWT_SECRET);
    decodedToken = { user_id: 1, nif: '123456789' };
    
    jest.spyOn(jwt, 'verify').mockReturnValue(decodedToken);
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    User.findByPk.mockResolvedValue({ user_id: 1, nif: '123456789' });
    UserRoles.findOne.mockResolvedValue({ user_id: 1, user_type: 'user' });
  });
  
  it('deve retornar 401 se o token não for fornecido', async () => {
    const res = await request(app).get('/api/orders/recipient_order_details/123');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token não fornecido');
  });
  
  it('deve retornar 400 se o ID do pedido não for fornecido', async () => {
    const res = await request(app)
      .get('/api/orders/recipient_order_details/')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('ID do pedido não fornecido');
  });
  
  it('deve retornar 404 se o pedido não for encontrado ou o usuário não for o destinatário', async () => {
    Order.findOne.mockResolvedValue(null);
    
    const res = await request(app)
      .get('/api/orders/recipient_order_details/123')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Pedido não encontrado ou o usuário não é o destinatário deste pedido.');
  });
  
  it('deve retornar 200 e os detalhes da encomenda se encontrado', async () => {
    const orderMock = {
      order_id: '123',
      sender_nif: '000000000',
      Recipients: [{ name: 'João', surname: 'Silva' }]
    };
    Order.findOne.mockResolvedValue(orderMock);
    
    const res = await request(app)
      .get('/api/orders/recipient_order_details/123')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Detalhes da encomenda recuperados com sucesso!');
    expect(res.body.order).toEqual(orderMock);
  });
  
  it('deve retornar 500 em caso de erro inesperado', async () => {
    Order.findOne.mockRejectedValue(new Error('Erro no servidor'));
    
    const res = await request(app)
      .get('/api/orders/recipient_order_details/123')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Erro ao recuperar os detalhes da encomenda.');
  });
});
