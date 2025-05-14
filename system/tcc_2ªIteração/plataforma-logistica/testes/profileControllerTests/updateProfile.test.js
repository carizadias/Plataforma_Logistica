const request = require('supertest');
const app = require('plataforma-logistica/app');
const jwt = require('jsonwebtoken');

jest.mock('plataforma-logistica/models', () => ({
  User: {
    findOne: jest.fn(),
  },
  PostOfficeUser: {
    findOne: jest.fn(),
  },
}));

const { User, PostOfficeUser } = require('plataforma-logistica/models');

describe('PUT /api/profile', () => {
  let tokenUser, tokenPostOfficeUser;
  const secret = process.env.JWT_SECRET || 'testsecret'; 

  beforeEach(() => {
    jest.clearAllMocks();
    tokenUser = jwt.sign({ user_id: 1, nif: '123456789' }, secret, { expiresIn: '1h' });
    tokenPostOfficeUser = jwt.sign({ id: 2 }, secret, { expiresIn: '1h' });
  });

  it('deve retornar 401 se o token não for fornecido', async () => {
    const res = await request(app)
      .put('/api/profile')
      .send({ name: 'Novo Nome', email: 'novo@example.com' });
      
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Acesso não autorizado. Token necessário.');
  });

  it('deve retornar 404 se o usuário comum não for encontrado', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({ name: 'Novo Nome', email: 'novo@example.com' });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Usuário não encontrado');
  });

  it('deve atualizar o perfil do usuário comum com sucesso', async () => {
    const fakeUser = {
      user_id: 1,
      name: 'Nome Antigo',
      email: 'antigo@example.com',
      update: jest.fn().mockResolvedValue(),
    };
    User.findOne.mockResolvedValue(fakeUser);

    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({ name: 'Novo Nome', email: 'novo@example.com' });

    expect(res.status).toBe(200);
    expect(fakeUser.update).toHaveBeenCalledWith({ name: 'Novo Nome', email: 'novo@example.com' });
    expect(res.body.message).toBe('Perfil atualizado com sucesso');
    expect(res.body.profile).toEqual({ name: fakeUser.name, email: fakeUser.email });
  });

  it('deve retornar 404 se o funcionário não for encontrado', async () => {
    PostOfficeUser.findOne.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${tokenPostOfficeUser}`)
      .send({ name: 'Novo Nome', email: 'novo@example.com' });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Funcionário não encontrado');
  });

  it('deve atualizar o perfil do funcionário com sucesso', async () => {
    const fakeEmployee = {
      post_office_user_id: 2,
      name: 'Nome Antigo',
      email: 'antigo@example.com',
      update: jest.fn().mockResolvedValue(),
    };
    PostOfficeUser.findOne.mockResolvedValue(fakeEmployee);

    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${tokenPostOfficeUser}`)
      .send({ name: 'Novo Nome', email: 'novo@example.com' });

    expect(res.status).toBe(200);
    expect(fakeEmployee.update).toHaveBeenCalledWith({ name: 'Novo Nome', email: 'novo@example.com' });
    expect(res.body.message).toBe('Perfil atualizado com sucesso');
    expect(res.body.profile).toEqual({ name: fakeEmployee.name, email: fakeEmployee.email });
  });

  it('deve retornar 500 em caso de erro interno ao atualizar o perfil', async () => {
    const fakeUser = {
      user_id: 1,
      name: 'Nome Antigo',
      email: 'antigo@example.com',
      update: jest.fn().mockRejectedValue(new Error('Erro na atualização')),
    };
    User.findOne.mockResolvedValue(fakeUser);

    const res = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({ name: 'Novo Nome', email: 'novo@example.com' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Erro ao atualizar perfil');
  });
});
