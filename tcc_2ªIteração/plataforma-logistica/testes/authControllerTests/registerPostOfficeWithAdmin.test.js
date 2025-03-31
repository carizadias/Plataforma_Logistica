
jest.mock('plataforma-logistica/models', () => ({
  PostOfficeUser: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  PostOffice: {
    create: jest.fn()
  },
  PostOfficeUserType: {
    findOne: jest.fn()
  },
  PostOfficeUserRoles: {
    create: jest.fn()
  }
}));

const { registerPostOfficeWithAdmin } = require('plataforma-logistica/src/controllers/authController.js');
const { PostOfficeUser, PostOffice, PostOfficeUserType, PostOfficeUserRoles } = require('plataforma-logistica/models');
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

describe('Testes para a função registerPostOfficeWithAdmin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Retorna erro 400 se o email já estiver cadastrado', async () => {
    const req = {
      body: {
        name: 'Correio Teste',
        country_id: 1,
        coverage_area: 'Área X',
        fee: 50,
        admin_email: 'admin@teste.com',
        admin_password: 'senhaAdmin'
      }
    };
    const res = createRes();

    PostOfficeUser.findOne.mockResolvedValue({ post_office_user_id: 1, email: req.body.admin_email });

    await registerPostOfficeWithAdmin(req, res);

    expect(PostOfficeUser.findOne).toHaveBeenCalledWith({ where: { email: req.body.admin_email } });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email já cadastrado" });
  });

  test('Retorna erro 400 se o tipo de usuário (admin) não for encontrado', async () => {
    const req = {
      body: {
        name: 'Correio Teste',
        country_id: 1,
        coverage_area: 'Área X',
        fee: 50,
        admin_email: 'novoadmin@teste.com',
        admin_password: 'senhaAdmin'
      }
    };
    const res = createRes();

    PostOfficeUser.findOne.mockResolvedValue(null);
    const mockPostOffice = {
      post_office_id: 10,
      name: req.body.name,
      country_id: req.body.country_id,
      coverage_area: req.body.coverage_area,
      fee: req.body.fee,
      is_active: false
    };
    PostOffice.create.mockResolvedValue(mockPostOffice);
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_senhaAdmin');
    const mockAdmin = {
      post_office_user_id: 20,
      email: req.body.admin_email,
      password: 'hashed_senhaAdmin',
      post_office_id: mockPostOffice.post_office_id,
      is_active: false,
      toJSON: () => ({
        post_office_user_id: 20,
        email: req.body.admin_email,
        post_office_id: mockPostOffice.post_office_id
      })
    };
    PostOfficeUser.create.mockResolvedValue(mockAdmin);
    PostOfficeUserType.findOne.mockResolvedValue(null);

    await registerPostOfficeWithAdmin(req, res);

    expect(PostOfficeUserType.findOne).toHaveBeenCalledWith({ where: { name: 'admin' } });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Tipo de usuário inválido' });
  });

  test('Registra Correio e Administrador com sucesso', async () => {
    const req = {
      body: {
        name: 'Correio Teste',
        country_id: 1,
        coverage_area: 'Área X',
        fee: 50,
        admin_email: 'novoadmin@teste.com',
        admin_password: 'senhaAdmin'
      }
    };
    const res = createRes();

    PostOfficeUser.findOne.mockResolvedValue(null);
    const mockPostOffice = {
      post_office_id: 10,
      name: req.body.name,
      country_id: req.body.country_id,
      coverage_area: req.body.coverage_area,
      fee: req.body.fee,
      is_active: false
    };
    PostOffice.create.mockResolvedValue(mockPostOffice);
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_senhaAdmin');
    const mockAdmin = {
      post_office_user_id: 20,
      email: req.body.admin_email,
      password: 'hashed_senhaAdmin',
      post_office_id: mockPostOffice.post_office_id,
      is_active: false,
      toJSON: () => ({
        post_office_user_id: 20,
        email: req.body.admin_email,
        post_office_id: mockPostOffice.post_office_id
      })
    };
    PostOfficeUser.create.mockResolvedValue(mockAdmin);
    const mockUserType = {
      post_office_user_type_id: 5,
      name: 'admin'
    };
    PostOfficeUserType.findOne.mockResolvedValue(mockUserType);
    PostOfficeUserRoles.create.mockResolvedValue({});

    await registerPostOfficeWithAdmin(req, res);

    expect(PostOfficeUser.findOne).toHaveBeenCalledWith({ where: { email: req.body.admin_email } });
    expect(PostOffice.create).toHaveBeenCalledWith({
      name: req.body.name,
      country_id: req.body.country_id,
      coverage_area: req.body.coverage_area,
      fee: req.body.fee,
      is_active: false
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.admin_password, 10);
    expect(PostOfficeUser.create).toHaveBeenCalledWith({
      email: req.body.admin_email,
      password: 'hashed_senhaAdmin',
      post_office_id: mockPostOffice.post_office_id,
      is_active: false
    });
    expect(PostOfficeUserType.findOne).toHaveBeenCalledWith({ where: { name: 'admin' } });
    expect(PostOfficeUserRoles.create).toHaveBeenCalledWith({
      post_office_user_id: mockAdmin.post_office_user_id,
      post_office_user_type_id: mockUserType.post_office_user_type_id
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Correio e Administrador registrados com sucesso! Aguardando aprovação do administrador geral.",
      postOffice: mockPostOffice,
      postOfficeAdmin: {
        post_office_user_id: 20,
        email: req.body.admin_email,
        post_office_id: mockPostOffice.post_office_id
      }
    });
  });

  test('Retorna erro 500 em caso de exceção', async () => {
    const req = {
      body: {
        name: 'Correio Teste',
        country_id: 1,
        coverage_area: 'Área X',
        fee: 50,
        admin_email: 'erro@teste.com',
        admin_password: 'senhaAdmin'
      }
    };
    const res = createRes();

    PostOfficeUser.findOne.mockRejectedValue(new Error('Erro no banco'));

    await registerPostOfficeWithAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao registrar Correio e Administrador!" });
  });
});
