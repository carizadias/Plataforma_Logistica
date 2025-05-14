
jest.mock('plataforma-logistica/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  UserRoles: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  PhoneNumber: {
    create: jest.fn()
  },
  Address: {
    create: jest.fn()
  }
}));

const { registerAdmin } = require('plataforma-logistica/src/controllers/authController.js');
const { User, UserRoles } = require('plataforma-logistica/models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Testes para a função registerAdmin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Retorna erro 400 se o NIF já está cadastrado para outro usuário', async () => {
    const req = {
      body: {
        nif: '123456789',
        name: 'Admin',
        surname: 'Teste',
        email: 'admin@email.com',
        password: 'senhaAdmin'
      }
    };
    const res = createRes();

    User.findOne.mockResolvedValue({ user_id: 1, nif: req.body.nif });
    
    await registerAdmin(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { [Op.or]: [{ email: req.body.email }, { nif: req.body.nif }] }
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Este NIF já está cadastrado para outro usuário!' });
  });

  test('Retorna erro 400 se o usuário já é um administrador', async () => {
    const req = {
      body: {
        nif: '987654321',
        name: 'Admin',
        surname: 'Teste',
        email: 'admin2@email.com',
        password: 'senhaAdmin'
      }
    };
    const res = createRes();

    User.findOne.mockResolvedValue({ user_id: 2, nif: '111111111' });
    UserRoles.findOne.mockResolvedValue({ user_id: 2, user_type: 'admin' });
    
    await registerAdmin(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { [Op.or]: [{ email: req.body.email }, { nif: req.body.nif }] }
    });
    expect(UserRoles.findOne).toHaveBeenCalledWith({
      where: { user_id: 2, user_type: 'admin' }
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Este usuário já é um administrador!' });
  });

  test('Registra um novo admin com sucesso', async () => {
    const req = {
      body: {
        nif: '555555555',
        name: 'Novo',
        surname: 'Admin',
        email: 'novoadmin@email.com',
        password: 'senhaNova'
      }
    };
    const res = createRes();

    User.findOne.mockResolvedValueOnce(null);
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_senhaAdmin');
    const mockUser = {
      user_id: 3,
      nif: req.body.nif,
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: 'hashed_senhaAdmin',
      is_active: true,
      toJSON: () => ({
        user_id: 3,
        nif: req.body.nif,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email
      })
    };
    User.create = jest.fn().mockResolvedValue(mockUser);
    UserRoles.create = jest.fn().mockResolvedValue({});

    await registerAdmin(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { [Op.or]: [{ email: req.body.email }, { nif: req.body.nif }] }
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
    expect(User.create).toHaveBeenCalledWith({
      nif: req.body.nif,
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: 'hashed_senhaAdmin',
      is_active: true
    });
    expect(UserRoles.create).toHaveBeenCalledWith({
      user_id: mockUser.user_id,
      user_type: 'admin'
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Admin registrado com sucesso!',
      userAdminResponse: {
        user_id: 3,
        nif: req.body.nif,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email
      }
    });
  });

  test('Retorna erro 500 em caso de exceção', async () => {
    const req = {
      body: {
        nif: '555555555',
        name: 'Novo',
        surname: 'Admin',
        email: 'novoadmin@email.com',
        password: 'senhaNova'
      }
    };
    const res = createRes();

    User.findOne.mockRejectedValue(new Error('Erro no banco'));

    await registerAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Erro ao registrar admin! Verifique se o token não está expirado'
    });
  });
});
