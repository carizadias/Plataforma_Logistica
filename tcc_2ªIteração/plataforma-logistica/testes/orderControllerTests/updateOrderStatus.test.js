const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');

jest.mock('../../models', () => ({
  Order: {
    findByPk: jest.fn()
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

jest.mock('../../src/services/emailService', () => ({
  sendOrderStatusNotification: jest.fn()
}));

const { Order, PostOfficeUser } = require('../../models');
const { sendOrderStatusNotification } = require('../../src/services/emailService');

describe('PUT /api/orders/:order_id/status', () => {
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
      .put('/api/orders/123/status')
      .send({ current_status: 'Delivered' });
      
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token não fornecido');
  });
  
  it('deve retornar 400 se current_status não for fornecido', async () => {
    const res = await request(app)
      .put('/api/orders/123/status')
      .set('Authorization', `Bearer ${token}`)
      .send({});
      
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Status atual não fornecido.");
  });
  
  it('deve retornar 404 se o pedido não for encontrado', async () => {
    Order.findByPk.mockResolvedValue(null);
    
    const res = await request(app)
      .put('/api/orders/123/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ current_status: 'Delivered' });
      
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Pedido não encontrado.");
  });
  
  it('deve retornar 200 e atualizar o status do pedido se tudo ocorrer bem', async () => {
    const orderMock = {
      order_id: '123',
      current_status: 'Pending',
      save: jest.fn().mockResolvedValue(true)
    };
    Order.findByPk.mockResolvedValue(orderMock);
    
    const res = await request(app)
      .put('/api/orders/123/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ current_status: 'Delivered' });
      
    expect(orderMock.current_status).toBe('Delivered');
    expect(orderMock.save).toHaveBeenCalled();
    expect(sendOrderStatusNotification).toHaveBeenCalledWith(orderMock, 'Delivered');
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Status do pedido atualizado com sucesso.");
    expect(res.body.order).toMatchObject({
        order_id: '123',
        current_status: 'Delivered'
      });
  });
  
  it('deve retornar 500 em caso de erro inesperado', async () => {
    Order.findByPk.mockRejectedValue(new Error('Erro no servidor'));
    
    const res = await request(app)
      .put('/api/orders/123/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ current_status: 'Delivered' });
      
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Erro interno no servidor, verifique se o token esta expirado");
  });
});
