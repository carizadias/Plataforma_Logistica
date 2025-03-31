const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('plataforma-logistica/app');
const { Address, User, PostOfficeUser, UserRoles } = require('plataforma-logistica/models');

jest.mock('plataforma-logistica/models', () => ({
  Address: {
    findAll: jest.fn()
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

describe('GET /api/profile/addresses', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Cenário: Usuário do tipo "user"', () => {
    let token;

    beforeEach(() => {
      token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      User.findByPk.mockResolvedValue({ user_id: 1 });
      UserRoles.findOne.mockResolvedValue({ user_id: 1, user_type: 'user' });
    });

    it('retorna 200 e os endereços quando encontrados', async () => {
      const fakeAddresses = [
        { id: 1, owner_id: 1, owner_type: 'user', address: 'Rua A' },
        { id: 2, owner_id: 1, owner_type: 'user', address: 'Rua B' }
      ];
      Address.findAll.mockResolvedValue(fakeAddresses);

      const res = await request(app)
        .get('/api/profile/addresses')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.addresses).toEqual(fakeAddresses);
      expect(Address.findAll).toHaveBeenCalledWith({
        where: { owner_id: 1, owner_type: 'user' }
      });
    });

    it('retorna 404 quando nenhum endereço for encontrado', async () => {
      Address.findAll.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/profile/addresses')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Nenhum endereço encontrado');
    });
  });

  describe('Cenário: Usuário do tipo "post_office"', () => {
    let token;

    beforeEach(() => {
      token = jwt.sign({ id: 10 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      User.findByPk.mockResolvedValue(null);
      UserRoles.findOne.mockResolvedValue(null);
      PostOfficeUser.findOne.mockResolvedValue({
        post_office_user_id: 10,
        post_office_id: 20,
        is_active: true,
        roles: [{ name: 'admin' }]
      });
    });

    it('retorna 200 e os endereços para post_office quando encontrados', async () => {
      const fakeAddresses = [
        { id: 3, owner_id: 20, owner_type: 'post_office', address: 'Avenida X' }
      ];
      Address.findAll.mockResolvedValue(fakeAddresses);

      const res = await request(app)
        .get('/api/profile/addresses')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.addresses).toEqual(fakeAddresses);
      expect(Address.findAll).toHaveBeenCalledWith({
        where: { owner_id: 20, owner_type: 'post_office' }
      });
    });

    it('retorna 404 quando nenhum endereço for encontrado para post_office', async () => {
      Address.findAll.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/profile/addresses')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Nenhum endereço encontrado');
    });
  });

  describe('Cenário: Tipo de usuário inválido', () => {
    let token;

    beforeEach(() => {
      token = jwt.sign({ user_id: 99 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      User.findByPk.mockResolvedValue(null);
      UserRoles.findOne.mockResolvedValue(null);
      PostOfficeUser.findOne.mockResolvedValue(null);
    });

    it('retorna 403 para tipo de usuário inválido', async () => {
      const res = await request(app)
        .get('/api/profile/addresses')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Tipo de usuário inválido');
    });
  });

  describe('Cenário: Erro interno na obtenção dos endereços', () => {
    let token;

    beforeEach(() => {
      token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      User.findByPk.mockResolvedValue({ user_id: 1 });
      UserRoles.findOne.mockResolvedValue({ user_id: 1, user_type: 'user' });
      Address.findAll.mockRejectedValue(new Error('Erro ao obter endereços'));
    });

    it('retorna 500 quando ocorre um erro interno', async () => {
      const res = await request(app)
        .get('/api/profile/addresses')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Erro ao obter endereços');
    });
  });
});
