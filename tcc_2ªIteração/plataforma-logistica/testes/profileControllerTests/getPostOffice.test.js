const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const { User, UserRoles, PostOfficeUser, PostOffice } = require('../../models');

jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn()
  },
  UserRoles: {
    findOne: jest.fn()
  },
  PostOfficeUser: {
    findByPk: jest.fn()
  },
  PostOffice: {
    findOne: jest.fn()
  }
}));

process.env.JWT_SECRET = 'segredo_teste';

describe('GET /api/profile/post_offices/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Cenário: Posto de correios encontrado e ativo', () => {
    let token;
    const postOfficeId = 10;
    const fakePostOffice = {
      post_office_id: postOfficeId,
      name: 'Posto Central',
      coverage_area: 'Área Metropolitana',
      fee: 20.5,
      is_active: 1
    };

    beforeEach(() => {
      token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      User.findByPk.mockResolvedValue({ user_id: 1 });
      UserRoles.findOne.mockResolvedValue({ user_id: 1, user_type: 'user' });
      PostOffice.findOne.mockResolvedValue(fakePostOffice);
    });

    it('deve retornar 200 e as informações do posto de correios', async () => {
      const res = await request(app)
        .get(`/api/profile/post_offices/${postOfficeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.postOffice).toEqual(fakePostOffice);
      expect(PostOffice.findOne).toHaveBeenCalledWith({
        attributes: ['post_office_id', 'name', 'coverage_area', 'fee', 'is_active'],
        where: {
          post_office_id: postOfficeId.toString(),
          is_active: 1
        }
      });
    });
  });

  describe('Cenário: Posto de correios não encontrado ou inativo', () => {
    let token;
    const postOfficeId = 20;

    beforeEach(() => {
      token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      User.findByPk.mockResolvedValue({ user_id: 1 });
      UserRoles.findOne.mockResolvedValue({ user_id: 1, user_type: 'user' });
      PostOffice.findOne.mockResolvedValue(null);
    });

    it('deve retornar 404 com a mensagem apropriada', async () => {
      const res = await request(app)
        .get(`/api/profile/post_offices/${postOfficeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Posto de correios não encontrado ou inativo');
    });
  });

  describe('Cenário: Erro interno ao buscar informações do posto de correios', () => {
    let token;
    const postOfficeId = 30;

    beforeEach(() => {
      token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      User.findByPk.mockResolvedValue({ user_id: 1 });
      UserRoles.findOne.mockResolvedValue({ user_id: 1, user_type: 'user' });
      PostOffice.findOne.mockRejectedValue(new Error('Erro inesperado'));
    });

    it('deve retornar 500 com a mensagem de erro', async () => {
      const res = await request(app)
        .get(`/api/profile/post_offices/${postOfficeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Erro ao buscar informações do posto de correios');
    });
  });
});
