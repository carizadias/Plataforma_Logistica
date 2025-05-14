const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('plataforma-logistica/app');
const { Address, User, PostOfficeUser, UserRoles } = require('plataforma-logistica/models');

jest.mock('plataforma-logistica/models', () => ({
  Address: {
    findOne: jest.fn(),
    update: jest.fn()
  },
  User: {
    findByPk: jest.fn()
  },
  PostOfficeUser: {
    findOne: jest.fn()
  },
  UserRoles: {
    findOne: jest.fn()
  }
}));

process.env.JWT_SECRET = 'segredo_teste';

describe('PUT /api/profile/addresses/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Cenário: Usuário do tipo "user"', () => {
    let token;
    const addressId = 1;
    const updatedData = {
      street: 'Nova Rua',
      door_number: '500',
      floor_number: '3',
      city_id: 15
    };

    beforeEach(() => {
      token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      User.findByPk.mockResolvedValue({ user_id: 1 });
      UserRoles.findOne.mockResolvedValue({ user_id: 1, user_type: 'user' });
      Address.findOne.mockResolvedValue({
        address_id: addressId,
        owner_id: 1,
        owner_type: 'user',
        update: jest.fn().mockResolvedValue()
      });
    });

    it('deve atualizar o endereço e retornar 200', async () => {
      const res = await request(app)
        .put(`/api/profile/addresses/${addressId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Endereço atualizado com sucesso');
      expect(Address.findOne).toHaveBeenCalledWith({
        where: { address_id: addressId.toString(), owner_id: 1, owner_type: 'user' }
      });
    });
  });

  describe('Cenário: Usuário do tipo "post_office"', () => {
    let token;
    const addressId = 2;
    const updatedData = {
      street: 'Rua Central',
      door_number: '200',
      floor_number: '5',
      city_id: 20
    };

    beforeEach(() => {
      token = jwt.sign({ id: 10 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      User.findByPk.mockResolvedValue(null);
      UserRoles.findOne.mockResolvedValue(null);
      PostOfficeUser.findOne.mockResolvedValue({
        post_office_user_id: 10,
        post_office_id: 300,
        is_active: true,
        roles: [{ name: 'admin' }]
      });
      Address.findOne.mockResolvedValue({
        address_id: addressId,
        owner_id: 300,
        owner_type: 'post_office',
        update: jest.fn().mockResolvedValue()
      });
    });

    it('deve atualizar o endereço e retornar 200', async () => {
      const res = await request(app)
        .put(`/api/profile/addresses/${addressId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Endereço atualizado com sucesso');
      expect(Address.findOne).toHaveBeenCalledWith({
        where: { address_id: addressId.toString(), owner_id: 300, owner_type: 'post_office' }
      });
    });
  });

  describe('Cenário: Endereço não encontrado', () => {
    let token;
    const addressId = 99;

    beforeEach(() => {
      token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      User.findByPk.mockResolvedValue({ user_id: 1 });
      UserRoles.findOne.mockResolvedValue({ user_id: 1, user_type: 'user' });
      Address.findOne.mockResolvedValue(null);
    });

    it('deve retornar 404 se o endereço não pertencer ao usuário', async () => {
      const res = await request(app)
        .put(`/api/profile/addresses/${addressId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ street: 'Rua Inexistente' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Endereço não encontrado ou não pertence a você');
    });
  });

  describe('Cenário: Erro interno', () => {
    let token;
    const addressId = 3;

    beforeEach(() => {
      token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      User.findByPk.mockResolvedValue({ user_id: 1 });
      UserRoles.findOne.mockResolvedValue({ user_id: 1, user_type: 'user' });
      Address.findOne.mockRejectedValue(new Error('Erro inesperado'));
    });

    it('deve retornar 500 em caso de erro inesperado', async () => {
      const res = await request(app)
        .put(`/api/profile/addresses/${addressId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ street: 'Rua Bugada' });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Erro ao atualizar endereço');
    });
  });
});
