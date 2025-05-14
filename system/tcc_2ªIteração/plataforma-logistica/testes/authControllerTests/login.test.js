jest.mock('plataforma-logistica/models', () => ({
  User: {
    findOne: jest.fn()
  },
  UserRoles: {
    findOne: jest.fn()
  }
}));

const { login } = require('plataforma-logistica/src/controllers/authController.js');
const { User, UserRoles } = require('plataforma-logistica/models');
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

describe('Testes para a função login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_Secret = 'secret_test';
  });

  test('Retorna erro 400 se o usuário não for encontrado', async () => {
    const req = {
      body: {
        email: 'notfound@example.com',
        password: 'qualquerSenha'
      }
    };
    const res = createRes();

    User.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario não encontrado' });
  });

  test('Retorna erro 400 se a senha estiver incorreta', async () => {
    const req = {
      body: {
        email: 'user@example.com',
        password: 'senhaErrada'
      }
    };
    const res = createRes();

    const mockUser = {
      user_id: 1,
      email: req.body.email,
      password: 'hashed_password',
      nif: '123456789'
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    await login(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, mockUser.password);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Senha incorreta' });
  });

  test('Retorna token com informações corretas quando o usuário e o papel são encontrados', async () => {
    const req = {
      body: {
        email: 'user@example.com',
        password: 'senhaCorreta'
      }
    };
    const res = createRes();

    const mockUser = {
      user_id: 1,
      email: req.body.email,
      password: 'hashed_password',
      nif: '123456789'
    };

    const mockUserRole = {
      user_id: 1,
      user_type: 'admin'
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    UserRoles.findOne.mockResolvedValue(mockUserRole);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const token = res.json.mock.calls[0][0].token;
    expect(token).toBeDefined();

    const decoded = jwt.verify(token, process.env.JWT_Secret);
    expect(decoded.user_id).toBe(mockUser.user_id);
    expect(decoded.nif).toBe(mockUser.nif);
    expect(decoded.type).toBe(mockUserRole.user_type);
  });

  test('Retorna token com tipo "user" se não houver papel registrado', async () => {
    const req = {
      body: {
        email: 'user2@example.com',
        password: 'senhaCorreta'
      }
    };
    const res = createRes();

    const mockUser = {
      user_id: 2,
      email: req.body.email,
      password: 'hashed_password',
      nif: '987654321'
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    UserRoles.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const token = res.json.mock.calls[0][0].token;
    expect(token).toBeDefined();

    const decoded = jwt.verify(token, process.env.JWT_Secret);
    expect(decoded.user_id).toBe(mockUser.user_id);
    expect(decoded.nif).toBe(mockUser.nif);
    expect(decoded.type).toBe('user');
  });

  test('Retorna erro 500 em caso de exceção', async () => {
    const req = {
      body: {
        email: 'error@example.com',
        password: 'senha'
      }
    };
    const res = createRes();

    User.findOne.mockRejectedValue(new Error('Erro no banco'));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro no servidor' });
  });
});
