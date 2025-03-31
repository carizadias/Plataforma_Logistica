const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('plataforma-logistica/app.js');

jest.mock('plataforma-logistica/models', () => ({
  Order: {
    findByPk: jest.fn()
  },
  Payment: {
    create: jest.fn()
  },
  User: {
    findByPk: jest.fn()
  },
  PostOfficeUser: {
    findByPk: jest.fn()
  },
  UserRoles: {
    findOne: jest.fn()
  }
}));

jest.mock('stripe', () => {
  const mockStripeInstance = {
    paymentIntents: {
      create: jest.fn()
    }
  };
  return jest.fn(() => mockStripeInstance);
});

const stripe = require('stripe');
const stripeInstance = stripe();

const { Order, Payment, User, UserRoles } = require('plataforma-logistica/models');

describe('POST /api/payments/pay', () => {
  let token;
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'defaultSecret';
    process.env.STRIPE_SECRET_KEY = 'dummy_key';

    token = jwt.sign({ user_id: 1, nif: '123456789' }, process.env.JWT_SECRET);

    User.findByPk.mockResolvedValue({ user_id: 1, nif: '123456789' });
    UserRoles.findOne.mockResolvedValue({ user_id: 1, user_type: 'user' });

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('deve retornar 401 se o token não for fornecido', async () => {
    const res = await request(app)
      .post('/api/payments/pay')
      .send({
        order_id: 1,
        amount: 10,
        currency: 'usd',
        payment_method_id: 'pm_123'
      });
      
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token não fornecido');
  });

  it('deve retornar 404 se o pedido não for encontrado', async () => {
    Order.findByPk.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/payments/pay')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order_id: 1,
        amount: 10,
        currency: 'usd',
        payment_method_id: 'pm_123'
      });
      
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Pedido não encontrado.");
  });

  it('deve retornar 400 se amount ou currency não forem fornecidos', async () => {
    Order.findByPk.mockResolvedValue({ update: jest.fn() });

    const res = await request(app)
      .post('/api/payments/pay')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order_id: 1,
        currency: 'usd',
        payment_method_id: 'pm_123'
      });
      
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Informe o valor e a moeda.");
  });

  it('deve retornar 200 e registrar o pagamento com sucesso', async () => {
    const fakePaymentIntent = { client_secret: 'secret_123' };
    stripeInstance.paymentIntents.create.mockResolvedValue(fakePaymentIntent);

    const orderMock = {
      update: jest.fn().mockResolvedValue(true)
    };
    Order.findByPk.mockResolvedValue(orderMock);

    const fakePayment = { payment_id: 100, amount: 10 };
    Payment.create.mockResolvedValue(fakePayment);

    const res = await request(app)
      .post('/api/payments/pay')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order_id: 1,
        amount: 10,
        currency: 'usd',
        payment_method_id: 'pm_123'
      });
      
    expect(stripeInstance.paymentIntents.create).toHaveBeenCalledWith({
      amount: 10 * 100,
      currency: 'usd',
      payment_method_types: ['card']
    });
    expect(Payment.create).toHaveBeenCalledWith({
      amount: 10,
      payment_status_id: 1,
      payment_method_id: 'pm_123'
    });
    expect(orderMock.update).toHaveBeenCalledWith({ payment_id: fakePayment.payment_id });

    expect(res.status).toBe(200);
    expect(res.body.clientSecret).toBe(fakePaymentIntent.client_secret);
    expect(res.body.message).toBe("Pagamento registrado no banco de dados!");
  });

  it('deve retornar 500 em caso de erro inesperado', async () => {
    Order.findByPk.mockRejectedValue(new Error('Erro no servidor'));

    const res = await request(app)
      .post('/api/payments/pay')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order_id: 1,
        amount: 10,
        currency: 'usd',
        payment_method_id: 'pm_123'
      });
      
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Erro ao processar pagamento.");
  });
});
