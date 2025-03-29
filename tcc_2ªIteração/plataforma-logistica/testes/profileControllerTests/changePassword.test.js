const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn(),
  },
  PostOfficeUser: {
    findOne: jest.fn(),
  },
}));

const { User, PostOfficeUser } = require('../../models');

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('PUT /api/profile/password', () => {
  let tokenUser, tokenEmployee;
  const secret = process.env.JWT_Secret || 'testsecret';

  beforeEach(() => {
    jest.clearAllMocks();
    tokenUser = jwt.sign({ user_id: 1 }, secret, { expiresIn: '1h' });
    tokenEmployee = jwt.sign({ id: 2 }, secret, { expiresIn: '1h' });
  });

  it('deve retornar 401 se o token não for fornecido', async () => {
    const res = await request(app)
      .put('/api/profile/password')
      .send({ oldPassword: 'oldpass', newPassword: 'newpass' });
      
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Acesso não autorizado. Token necessário.');
  });

  it('deve retornar 404 se o usuário comum não for encontrado', async () => {
    User.findOne.mockResolvedValue(null);
    
    const res = await request(app)
      .put('/api/profile/password')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({ oldPassword: 'oldpass', newPassword: 'newpass' });
      
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Usuário não encontrado');
  });

  it('deve retornar 404 se o funcionário não for encontrado', async () => {
    PostOfficeUser.findOne.mockResolvedValue(null);
    
    const res = await request(app)
      .put('/api/profile/password')
      .set('Authorization', `Bearer ${tokenEmployee}`)
      .send({ oldPassword: 'oldpass', newPassword: 'newpass' });
      
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Funcionário não encontrado');
  });

  it('deve retornar 400 se a senha atual estiver incorreta', async () => {
    const fakeUser = {
      user_id: 1,
      password: 'hashedpassword',
      update: jest.fn(),
    };
    User.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .put('/api/profile/password')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({ oldPassword: 'wrongpass', newPassword: 'newpass' });
      
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Senha atual incorreta');
  });

  it('deve alterar a senha com sucesso para usuário comum', async () => {
    const fakeUser = {
      user_id: 1,
      password: 'hashedpassword',
      name: 'John Doe',
      email: 'john@example.com',
      update: jest.fn().mockResolvedValue(),
    };
    User.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);
    bcrypt.hash.mockResolvedValue('newhashedpassword');

    const res = await request(app)
      .put('/api/profile/password')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({ oldPassword: 'oldpass', newPassword: 'newpass' });
      
    expect(fakeUser.update).toHaveBeenCalledWith({ password: 'newhashedpassword' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Senha alterada com sucesso');
  });

  it('deve retornar 500 se ocorrer erro durante a atualização', async () => {
    const fakeUser = {
      user_id: 1,
      password: 'hashedpassword',
      update: jest.fn().mockRejectedValue(new Error('Erro na atualização')),
    };
    User.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);
    bcrypt.hash.mockResolvedValue('newhashedpassword');

    const res = await request(app)
      .put('/api/profile/password')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({ oldPassword: 'oldpass', newPassword: 'newpass' });
      
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Erro ao alterar senha');
  });
});
