const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');
const { 
  Order, Payment, PostOffice, OrderType, DeliveryType, 
  Recipient, User, OrderRecipient 
} = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/models');

jest.mock('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/models', () => {
  return {
    Order: {
      create: jest.fn(),
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
    }
  };
});
jest.mock('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/src/services/emailService.js', () => ({
  sendOrderStatusNotification: jest.fn()
}));

describe('POST /orders', () => {
  let token, decodedToken;

beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
    token = jwt.sign({ user_id: 1, nif: '123456789' }, process.env.JWT_SECRET);
    decodedToken = { user_id: 1, nif: '123456789' };
    jest.spyOn(jwt, 'verify').mockReturnValue(decodedToken);
    
    User.findByPk = jest.fn().mockResolvedValue({ user_id: 1, nif: '123456789' });
    
    const { UserRoles } = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/models');
    UserRoles.findOne = jest.fn().mockResolvedValue({ user_id: 1, user_type: 'user' });
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  
  it('deve retornar erro 400 se campos obrigatórios estiverem ausentes', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Campos obrigatórios ausentes.');
  });

  it('deve retornar erro 401 se o token não for fornecido', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({});
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token não fornecido');
  });

  it('deve retornar erro 400 se o pagamento não existir', async () => {
    Payment.findOne.mockResolvedValue(null);
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order_type_id: 1,
        height: 10,
        width: 10,
        weight: 1,
        payment_id: 1,
        send_date: '2025-03-25',
        post_office_id: 1,
        description: 'Encomenda teste',
        delivery_type_id: 1,
        recipient_nifs: ['987654321'],
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Pagamento inválido');
  });

  it('deve criar um pedido de entrega com sucesso e processar destinatários', async () => {
    Payment.findOne.mockResolvedValue({ id: 1 });
    PostOffice.findOne.mockResolvedValue({ id: 1 });
    OrderType.findOne.mockResolvedValue({ id: 1 });
    DeliveryType.findOne.mockResolvedValue({ id: 1 });
    Order.create.mockResolvedValue({ order_id: 1, tracking_code: 'TRK-12345' });
    
    Recipient.findOne.mockResolvedValue(null);
    User.findOne.mockResolvedValue({ 
      nif: '987654321', 
      name: 'Teste', 
      surname: 'User', 
      email: 'teste@email.com',
      address_id: 1, 
      phone_number_id: 1 
    });
    Recipient.create.mockResolvedValue({ user_nif: '987654321' });
    OrderRecipient.create.mockResolvedValue({});
    
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order_type_id: 1,
        height: 10,
        width: 10,
        weight: 1,
        payment_id: 1,
        send_date: '2025-03-25',
        post_office_id: 1,
        description: 'Encomenda teste',
        delivery_type_id: 1,
        recipient_nifs: ['987654321'],
      });
      
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Pedido de entrega criado com sucesso!');
    expect(res.body.order.order_id).toBe(1);
  });

  it('deve retornar erro 500 em caso de erro inesperado', async () => {
    Order.create.mockRejectedValue(new Error('Erro no servidor'));
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order_type_id: 1,
        height: 10,
        width: 10,
        weight: 1,
        payment_id: 1,
        send_date: '2025-03-25',
        post_office_id: 1,
        recipient_nifs: ['987654321'],
      });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Erro ao criar pedido de entrega');
  });
});
