const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const { Address, User, PostOfficeUser, UserRoles } = require('../../models');

jest.mock('../../models', () => ({
  Address: {
    findOne: jest.fn(),
    destroy: jest.fn()
  },
  User: {
    findByPk: jest.fn(),
    findOne: jest.fn()
  },
  PostOfficeUser: {
    findOne: jest.fn()
  },
  UserRoles: {
    findOne: jest.fn()
  }
}));

process.env.JWT_SECRET = 'segredo_teste';

describe('DELETE /api/profile/addresses/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Cenário: Usuário do tipo "user"', () => {
    let token;
    const addressId = 1;

    beforeEach(() => {
      token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      User.findByPk.mockResolvedValue({ user_id: 1 });
      UserRoles.findOne.mockResolvedValue({ user_id: 1, user_type: 'user' });
      Address.findOne.mockResolvedValue({
        address_id: addressId,
        owner_id: 1,
        owner_type: 'user',
        destroy: jest.fn().mockResolvedValue()
      });
    });

    it('deve remover o endereço e atualizar o usuário se estiver referenciado, retornando 200', async () => {
      const userReferencing = {
        address_id: addressId,
        save: jest.fn().mockResolvedValue()
      };
      User.findOne.mockResolvedValue(userReferencing);

      const res = await request(app)
        .delete(`/api/profile/addresses/${addressId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Endereço removido com sucesso');
      expect(Address.findOne).toHaveBeenCalledWith({
        where: { address_id: addressId.toString(), owner_id: 1, owner_type: 'user' }
      });
      expect(userReferencing.address_id).toBeNull();
      expect(userReferencing.save).toHaveBeenCalled();
      expect((await Address.findOne()).destroy).toHaveBeenCalled();
    });
  });

  describe('Cenário: Usuário do tipo "post_office"', () => {
    let token;
    const addressId = 2;

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
        destroy: jest.fn().mockResolvedValue()
      });
    });

    it('deve remover o endereço e retornar 200', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .delete(`/api/profile/addresses/${addressId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Endereço removido com sucesso');
      expect(Address.findOne).toHaveBeenCalledWith({
        where: { address_id: addressId.toString(), owner_id: 300, owner_type: 'post_office' }
      });
      expect((await Address.findOne()).destroy).toHaveBeenCalled();
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

    it('deve retornar 404 se o endereço não existir ou não pertencer ao usuário', async () => {
      const res = await request(app)
        .delete(`/api/profile/addresses/${addressId}`)
        .set('Authorization', `Bearer ${token}`);

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
        .delete(`/api/profile/addresses/${addressId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Erro ao remover endereço');
    });
  });
});
