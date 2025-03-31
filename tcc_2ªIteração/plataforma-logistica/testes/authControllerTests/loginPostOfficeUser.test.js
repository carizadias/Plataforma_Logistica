jest.mock('plataforma-logistica/models', () => ({
  PostOfficeUser: {
    findOne: jest.fn()
  },
  PostOfficeUserType: {}
}));

const { loginPostOffice } = require('plataforma-logistica/src/controllers/authController.js');
const { PostOfficeUser } = require('plataforma-logistica/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Testes para a função loginPostOffice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_Secret = 'secret_test';
  });

  test('Retorna erro 400 se o usuário do Correio não for encontrado', async () => {
    const req = {
      body: {
        email: 'naoexiste@correio.com',
        password: 'qualquerSenha'
      }
    };
    const res = createRes();

    PostOfficeUser.findOne.mockResolvedValue(null);

    await loginPostOffice(req, res);

    expect(PostOfficeUser.findOne).toHaveBeenCalledWith({
      where: { email: req.body.email },
      include: {
        model: expect.any(Object),
        through: { attributes: [] },
        as: 'roles'
      }
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário do Correio não encontrado' });
  });

  test('Retorna erro 400 se a senha estiver incorreta', async () => {
    const req = {
      body: {
        email: 'user@correio.com',
        password: 'senhaIncorreta'
      }
    };
    const res = createRes();

    const mockUser = {
      post_office_user_id: 1,
      email: req.body.email,
      password: 'hashed_password',
      nif: '123456789',
      post_office_id: 10,
      is_active: true,
      roles: [{ name: 'admin' }]
    };

    PostOfficeUser.findOne.mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    await loginPostOffice(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, mockUser.password);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Senha incorreta' });
  });

  test('Retorna erro 403 se o usuário do Correio não estiver validado', async () => {
    const req = {
      body: {
        email: 'user@correio.com',
        password: 'senhaCorreta'
      }
    };
    const res = createRes();

    const mockUser = {
      post_office_user_id: 2,
      email: req.body.email,
      password: 'hashed_password',
      post_office_id: 20,
      is_active: false,
      roles: [{ name: 'admin' }]
    };

    PostOfficeUser.findOne.mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    await loginPostOffice(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Utilizador não esta validado' });
  });

  test('Retorna token com informações corretas quando o login é bem-sucedido e há role', async () => {
    const req = {
      body: {
        email: 'user@correio.com',
        password: 'senhaCorreta'
      }
    };
    const res = createRes();

    const mockUser = {
      post_office_user_id: 3,
      email: req.body.email,
      password: 'hashed_password',
      post_office_id: 30,
      is_active: true,
      roles: [{ name: 'admin' }]
    };

    PostOfficeUser.findOne.mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    await loginPostOffice(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const token = res.json.mock.calls[0][0].token;
    expect(token).toBeDefined();

    const decoded = jwt.verify(token, process.env.JWT_Secret);
    expect(decoded.id).toBe(mockUser.post_office_user_id);
    expect(decoded.post_office_id).toBe(mockUser.post_office_id);
    expect(decoded.role).toBe(mockUser.roles[0].name);
  });

  test('Retorna token com role "employee" se o usuário não tiver roles associadas', async () => {
    const req = {
      body: {
        email: 'user2@correio.com',
        password: 'senhaCorreta'
      }
    };
    const res = createRes();

    const mockUser = {
      post_office_user_id: 4,
      email: req.body.email,
      password: 'hashed_password',
      post_office_id: 40,
      is_active: true,
      roles: []
    };

    PostOfficeUser.findOne.mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    await loginPostOffice(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const token = res.json.mock.calls[0][0].token;
    expect(token).toBeDefined();

    const decoded = jwt.verify(token, process.env.JWT_Secret);
    expect(decoded.id).toBe(mockUser.post_office_user_id);
    expect(decoded.post_office_id).toBe(mockUser.post_office_id);
    expect(decoded.role).toBe('employee');
  });

  test('Retorna erro 500 em caso de exceção', async () => {
    const req = {
      body: {
        email: 'error@correio.com',
        password: 'senha'
      }
    };
    const res = createRes();

    PostOfficeUser.findOne.mockRejectedValue(new Error('Erro no banco'));

    await loginPostOffice(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro no servidor' });
  });
});
