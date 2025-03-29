const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');

jest.mock('../../models', () => ({
  Order: {
    findAll: jest.fn()
  },
  PostOfficeUser: {
    findByPk: jest.fn()
  }
}));

jest.mock('../../src/services/emailService', () => ({
  sendOrderStatusNotification: jest.fn()
}));

const { Order, PostOfficeUser } = require('../../models');

describe('GET /api/orders/post_office_orders/:post_office_id', () => {
  let token;
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
    
    token = jwt.sign({ id: 1, user_id: 1, nif: '123456789', role: 'employee' }, process.env.JWT_SECRET);
    
    PostOfficeUser.findByPk.mockResolvedValue({
      id: 1,
      is_active: true,
      getRoles: jest.fn().mockResolvedValue([{ name: 'employee' }])
    });
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  it('deve retornar 401 se o token não for fornecido', async () => {
    const res = await request(app)
      .get('/api/orders/post_office_orders/1');
      
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token não fornecido');
  });
  
  it('deve retornar 404 se nenhuma encomenda for encontrada para o posto de correios', async () => {
    Order.findAll.mockResolvedValue([]);
    
    const res = await request(app)
      .get('/api/orders/post_office_orders/1')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Nenhuma encomenda encontrada para este posto de correios');
  });
  
  it('deve retornar 200 e as encomendas se encontradas', async () => {
    const ordersMock = [
      {
        order_id: '101',
        current_status: 'Pending',
        sender_nif: '123456789',
        tracking_code: 'TRK-101',
        send_date: '2025-03-28'
      },
      {
        order_id: '102',
        current_status: 'Delivered',
        sender_nif: '987654321',
        tracking_code: 'TRK-102',
        send_date: '2025-03-27'
      }
    ];
    Order.findAll.mockResolvedValue(ordersMock);
    
    const res = await request(app)
      .get('/api/orders/post_office_orders/1')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Encomendas recuperadas com sucesso!');
    expect(res.body.orders).toEqual(ordersMock);
  });
  
  it('deve retornar 500 em caso de erro inesperado', async () => {
    Order.findAll.mockRejectedValue(new Error('Erro no servidor'));
    
    const res = await request(app)
      .get('/api/orders/post_office_orders/1')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Erro ao recuperar encomendas.');
  });
});
