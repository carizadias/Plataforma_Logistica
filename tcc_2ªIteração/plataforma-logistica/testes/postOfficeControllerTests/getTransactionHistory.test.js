const request = require('supertest');
const app = require('../../app');
const { Order, Payment, PaymentMethod, PaymentStatus, PostOfficeUser } = require('../../models');
const jwt = require('jsonwebtoken');

jest.mock('../../models', () => ({
  Order: {
    findAll: jest.fn(),
  },
  PostOfficeUser: {
    findByPk: jest.fn(),
  },
}));

describe('GET /api/post_offices/:postOfficeId/transactions', () => {
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
      .get('/api/post_offices/1/transactions');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token não fornecido');
  });

  it('deve retornar 403 se o usuário não for admin', async () => {
    const invalidToken = jwt.sign({ id: 2, user_id: 2 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    PostOfficeUser.findByPk.mockResolvedValue(nonAdminUser);

    const res = await request(app)
      .get('/api/post_offices/1/transactions')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toContain('Acesso negado');
  });

  it('deve retornar o histórico de transações com sucesso', async () => {
    PostOfficeUser.findByPk.mockResolvedValue(adminUser);
    const fakeTransactions = [
      {
        id: 1,
        post_office_id: 1,
        payment: {
          id: 1,
          paymentMethod: { id: 1, name: 'Cartão' },
          paymentStatus: { id: 1, name: 'Pago' },
        },
      },
    ];
    Order.findAll.mockResolvedValue(fakeTransactions);

    const res = await request(app)
      .get('/api/post_offices/1/transactions')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.transactions).toEqual(fakeTransactions);
    expect(Order.findAll).toHaveBeenCalledWith({
      where: { post_office_id: '1' },
      include: [
        {
          model: Payment,
          as: 'payment',
          include: [
            { model: PaymentMethod, as: 'paymentMethod' },
            { model: PaymentStatus, as: 'paymentStatus' },
          ],
        },
      ],
    });
  });

  it('deve retornar 500 em caso de erro interno', async () => {
    PostOfficeUser.findByPk.mockResolvedValue(adminUser);
    Order.findAll.mockRejectedValue(new Error('Erro inesperado'));

    const res = await request(app)
      .get('/api/post_offices/1/transactions')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Erro interno do servidor');
  });
});
