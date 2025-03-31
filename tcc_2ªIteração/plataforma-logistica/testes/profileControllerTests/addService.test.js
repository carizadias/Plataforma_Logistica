const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('plataforma-logistica/app.js');
const { Address, User, PostOfficeUser, UserRoles } = require('plataforma-logistica/models');

jest.mock('plataforma-logistica/models', () => ({
  Address: {
    create: jest.fn()
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

describe('POST /api/profile/addresses', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Cenário: Usuário do tipo "user"', () => {
    let token;
    const newAddressPayload = {
      street: 'Rua Teste',
      door_number: '123',
      floor_number: '1',
      city_id: 10
    };

    beforeEach(() => {
      token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      User.findByPk.mockResolvedValue({ user_id: 1 });
      UserRoles.findOne.mockResolvedValue({ user_id: 1, user_type: 'user' });
    });

    it('deve criar um endereço e retornar 201 para usuário comum', async () => {
      const createdAddress = {
        id: 100,
        street: newAddressPayload.street,
        door_number: newAddressPayload.door_number,
        floor_number: newAddressPayload.floor_number,
        city_id: newAddressPayload.city_id,
        owner_id: 1,
        owner_type: 'user'
      };
      Address.create.mockResolvedValue(createdAddress);

      const res = await request(app)
        .post('/api/profile/addresses')
        .set('Authorization', `Bearer ${token}`)
        .send(newAddressPayload);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Endereço adicionado com sucesso');
      expect(res.body.address).toEqual(createdAddress);
      expect(Address.create).toHaveBeenCalledWith({
        ...newAddressPayload,
        owner_id: 1,
        owner_type: 'user'
      });
    });
  });

  describe('Cenário: Usuário do tipo "post_office"', () => {
    let token;
    const newAddressPayload = {
      street: 'Avenida Central',
      door_number: '456',
      floor_number: '2',
      city_id: 20
    };

    beforeEach(() => {
      token = jwt.sign({ id: 10 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      User.findByPk.mockResolvedValue(null);
      UserRoles.findOne.mockResolvedValue(null);
      PostOfficeUser.findOne.mockResolvedValue({
        post_office_user_id: 10,
        post_office_id: 200,
        is_active: true,
        roles: [{ name: 'admin' }]
      });
    });

    it('deve criar um endereço e retornar 201 para post_office', async () => {
      const createdAddress = {
        id: 101,
        street: newAddressPayload.street,
        door_number: newAddressPayload.door_number,
        floor_number: newAddressPayload.floor_number,
        city_id: newAddressPayload.city_id,
        owner_id: 200,
        owner_type: 'post_office'
      };
      Address.create.mockResolvedValue(createdAddress);

      const res = await request(app)
        .post('/api/profile/addresses')
        .set('Authorization', `Bearer ${token}`)
        .send(newAddressPayload);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Endereço adicionado com sucesso');
      expect(res.body.address).toEqual(createdAddress);
      expect(Address.create).toHaveBeenCalledWith({
        ...newAddressPayload,
        owner_id: 200,
        owner_type: 'post_office'
      });
    });
  });

  describe('Cenário: Erro interno ao criar endereço', () => {
    let token;
    const newAddressPayload = {
      street: 'Rua Erro',
      door_number: '999',
      floor_number: '9',
      city_id: 30
    };

    beforeEach(() => {
      token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      User.findByPk.mockResolvedValue({ user_id: 1 });
      UserRoles.findOne.mockResolvedValue({ user_id: 1, user_type: 'user' });
      Address.create.mockRejectedValue(new Error('Erro ao adicionar endereço'));
    });

    it('deve retornar 500 quando ocorrer um erro interno', async () => {
      const res = await request(app)
        .post('/api/profile/addresses')
        .set('Authorization', `Bearer ${token}`)
        .send(newAddressPayload);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Erro ao adicionar endereço');
    });
  });
});
