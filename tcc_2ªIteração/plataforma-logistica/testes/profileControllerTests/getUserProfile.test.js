const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');

jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn(),
  },
  PostOfficeUser: {
    findOne: jest.fn(),
  },
}));

const { User, PostOfficeUser } = require('../../models');

describe('GET /api/profile/me', () => {
  let tokenUser;
  let tokenPostOfficeUser;

  beforeEach(() => {
    jest.clearAllMocks();
    tokenUser = jwt.sign({ user_id: 1, nif: '123456789' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    tokenPostOfficeUser = jwt.sign({ id: 2 }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  it('deve retornar 401 se não houver token', async () => {
    const res = await request(app).get('/api/profile/me');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Acesso não autorizado. Token necessário.');
  });

  it('deve retornar 404 se o usuário comum não for encontrado', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .get('/api/profile/me')
      .set('Authorization', `Bearer ${tokenUser}`);
      
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Usuário não encontrado');
  });

  it('deve retornar o perfil do usuário comum com sucesso', async () => {
    const fakeUser = {
      nif: '123456789',
      name: 'John Doe',
      email: 'john@example.com',
      roles: [{ name: 'customer' }]
    };
    User.findOne.mockResolvedValue(fakeUser);

    const res = await request(app)
      .get('/api/profile/me')
      .set('Authorization', `Bearer ${tokenUser}`);
      
    expect(res.status).toBe(200);
    expect(res.body.user).toEqual(fakeUser);
  });

  it('deve retornar 404 se o funcionário (post office user) não for encontrado', async () => {
    PostOfficeUser.findOne.mockResolvedValue(null);

    const res = await request(app)
      .get('/api/profile/me')
      .set('Authorization', `Bearer ${tokenPostOfficeUser}`);
      
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Funcionário não encontrado');
  });

  it('deve retornar o perfil do funcionário (post office user) com sucesso', async () => {
    const fakeEmployee = {
      post_office_user_id: 2,
      email: 'employee@example.com',
      roles: [{ name: 'admin' }]
    };
    PostOfficeUser.findOne.mockResolvedValue(fakeEmployee);

    const res = await request(app)
      .get('/api/profile/me')
      .set('Authorization', `Bearer ${tokenPostOfficeUser}`);
      
    expect(res.status).toBe(200);
    expect(res.body.user).toEqual(fakeEmployee);
  });

  it('deve retornar 401 se o token for inválido (sem user_id nem id)', async () => {
    const invalidToken = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .get('/api/profile/me')
      .set('Authorization', `Bearer ${invalidToken}`);
      
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token inválido. Nenhuma informação de usuário ou funcionário encontrada.');
  });

  it('deve retornar 500 em caso de erro interno', async () => {
    User.findOne.mockRejectedValue(new Error('Unexpected error'));

    const res = await request(app)
      .get('/api/profile/me')
      .set('Authorization', `Bearer ${tokenUser}`);
      
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Erro no servidor');
  });
});
