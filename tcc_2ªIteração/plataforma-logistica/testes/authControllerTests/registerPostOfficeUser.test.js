jest.mock('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/models', () => ({
  PostOfficeUser: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  PostOfficeUserType: {
    findOne: jest.fn()
  },
  PostOfficeUserRoles: {
    create: jest.fn()
  },
}));

const { registerPostOfficeUser } = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/src/controllers/authController.js');
const { PostOfficeUser, PostOfficeUserType, PostOfficeUserRoles } = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/models');
const bcrypt = require('bcryptjs');

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Testes para a função registerPostOfficeUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Retorna erro 400 se algum campo obrigatório estiver faltando', async () => {
    const req = {
      body: {
        password: 'senha',
        post_office_id: 1,
        role: 'employee'
      }
    };
    const res = createRes();

    await registerPostOfficeUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Todos os campos são obrigatórios." });
  });

  test('Retorna erro 400 se o email já estiver cadastrado', async () => {
    const req = {
      body: {
        email: 'teste@correio.com',
        password: 'senha',
        post_office_id: 1,
        role: 'employee'
      }
    };
    const res = createRes();

    PostOfficeUser.findOne.mockResolvedValue({ post_office_user_id: 1, email: req.body.email });

    await registerPostOfficeUser(req, res);

    expect(PostOfficeUser.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email já cadastrado' });
  });

  test('Retorna erro 400 se o role informado for inválido', async () => {
    const req = {
      body: {
        email: 'novo@correio.com',
        password: 'senha',
        post_office_id: 1,
        role: 'gerente'
      }
    };
    const res = createRes();

    PostOfficeUser.findOne.mockResolvedValue(null);

    await registerPostOfficeUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Tipo de usuário inválido. Deve ser admin ou employee.' });
  });

  test('Retorna erro 400 se não for encontrado o tipo de usuário', async () => {
    const req = {
      body: {
        email: 'novo@correio.com',
        password: 'senha',
        post_office_id: 1,
        role: 'employee'
      }
    };
    const res = createRes();

    PostOfficeUser.findOne.mockResolvedValue(null);
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_senha');
    const mockUser = {
      post_office_user_id: 2,
      email: req.body.email,
      password: 'hashed_senha',
      post_office_id: req.body.post_office_id,
      is_active: true,
      toJSON: () => ({
        post_office_user_id: 2,
        email: req.body.email,
        post_office_id: req.body.post_office_id
      })
    };
    PostOfficeUser.create = jest.fn().mockResolvedValue(mockUser);
    PostOfficeUserType.findOne.mockResolvedValue(null);

    await registerPostOfficeUser(req, res);

    expect(PostOfficeUserType.findOne).toHaveBeenCalledWith({ where: { name: req.body.role } });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Tipo de usuário inválido' });
  });

  test('Registra um novo usuário do Correio com sucesso', async () => {
    const req = {
      body: {
        email: 'novo@correio.com',
        password: 'senha',
        post_office_id: 1,
        role: 'employee'
      }
    };
    const res = createRes();

    PostOfficeUser.findOne.mockResolvedValue(null);
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_senha');
    const mockUser = {
      post_office_user_id: 3,
      email: req.body.email,
      password: 'hashed_senha',
      post_office_id: req.body.post_office_id,
      is_active: true,
      toJSON: () => ({
        post_office_user_id: 3,
        email: req.body.email,
        post_office_id: req.body.post_office_id
      })
    };
    PostOfficeUser.create = jest.fn().mockResolvedValue(mockUser);
    const mockUserType = {
      post_office_user_type_id: 10,
      name: req.body.role
    };
    PostOfficeUserType.findOne = jest.fn().mockResolvedValue(mockUserType);
    PostOfficeUserRoles.create = jest.fn().mockResolvedValue({});

    await registerPostOfficeUser(req, res);

    expect(PostOfficeUser.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
    expect(PostOfficeUser.create).toHaveBeenCalledWith({
      email: req.body.email,
      password: 'hashed_senha',
      post_office_id: req.body.post_office_id,
      is_active: true
    });
    expect(PostOfficeUserType.findOne).toHaveBeenCalledWith({ where: { name: req.body.role } });
    expect(PostOfficeUserRoles.create).toHaveBeenCalledWith({
      post_office_user_id: mockUser.post_office_user_id,
      post_office_user_type_id: mockUserType.post_office_user_type_id
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuário do Correio registrado com sucesso',
      newUser: {
        post_office_user_id: 3,
        email: req.body.email,
        post_office_id: req.body.post_office_id
      },
      role: mockUserType.name
    });
  });

  test('Retorna erro 500 em caso de exceção', async () => {
    const req = {
      body: {
        email: 'erro@correio.com',
        password: 'senha',
        post_office_id: 1,
        role: 'employee'
      }
    };
    const res = createRes();

    PostOfficeUser.findOne.mockRejectedValue(new Error('Erro no banco'));

    await registerPostOfficeUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro no servidor' });
  });
});
