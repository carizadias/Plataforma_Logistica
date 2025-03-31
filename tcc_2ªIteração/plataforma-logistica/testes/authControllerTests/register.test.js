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


const { register } = require('plataforma-logistica/src/controllers/authController.js');
const { User, UserRoles, PhoneNumber, Address } = require('plataforma-logistica/models');
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

describe('Testes para a função register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Retorna erro 400 se o usuário já existe com o papel "user"', async () => {
    const req = {
      body: {
        nif: '123456789',
        name: 'Teste',
        surname: 'Usuário',
        email: 'teste@email.com',
        password: 'senha',
        phone_number: '987654321',
        phone_number_code: '+244',
        street: 'Rua Principal',
        door_number: '10',
        floor_number: '2',
        city_id: 1,
      },
    };
    const res = createRes();

    User.findOne.mockResolvedValue({ user_id: 1 });
    UserRoles.findOne = jest.fn().mockResolvedValue({ user_id: 1, user_type: 'user' });

    await register(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(UserRoles.findOne).toHaveBeenCalledWith({ where: { user_id: 1, user_type: 'user' } });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Usuário já é um utilizador!" });
  });

  test('Atualiza usuário para incluir o papel "user" se existir sem o papel', async () => {
    const req = {
      body: {
        nif: '123456789',
        name: 'Teste',
        surname: 'Usuário',
        email: 'teste@email.com',
        password: 'senha',
        phone_number: '987654321',
        phone_number_code: '+244',
        street: 'Rua Principal',
        door_number: '10',
        floor_number: '2',
        city_id: 1,
      },
    };
    const res = createRes();

    User.findOne.mockResolvedValue({ user_id: 1 });
    UserRoles.findOne = jest.fn().mockResolvedValue(null);
    UserRoles.create = jest.fn().mockResolvedValue({});

    await register(req, res);

    expect(UserRoles.create).toHaveBeenCalledWith({ user_id: 1, user_type: "user" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Usuário atualizado para utilizador com sucesso!" });
  });

  test('Retorna erro 400 se o NIF já existe', async () => {
    const req = {
      body: {
        nif: '123456789',
        name: 'Teste',
        surname: 'Usuário',
        email: 'novo@email.com',
        password: 'senha',
        phone_number: '987654321',
        phone_number_code: '+244',
        street: 'Rua Principal',
        door_number: '10',
        floor_number: '2',
        city_id: 1,
      },
    };
    const res = createRes();

    User.findOne
      .mockResolvedValueOnce(null) 
      .mockResolvedValueOnce({ user_id: 2 }); 

    await register(req, res);

    expect(User.findOne).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário  com este nif já existe' });
  });

  test('Registra um novo usuário com sucesso', async () => {
    const req = {
      body: {
        nif: '123456789',
        name: 'Teste',
        surname: 'Usuário',
        email: 'teste@email.com',
        password: 'senha',
        phone_number: '987654321',
        phone_number_code: '+244',
        street: 'Rua Principal',
        door_number: '10',
        floor_number: '2',
        city_id: 1,
      },
    };
    const res = createRes();

    User.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    const mockUser = {
      user_id: 3,
      nif: req.body.nif,
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: 'hashed_senha',
      save: jest.fn(),
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
    PhoneNumber.create = jest.fn().mockResolvedValue({ phone_number_id: 10 });
    Address.create = jest.fn().mockResolvedValue({ address_id: 20 });
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_senha');

    await register(req, res);

    expect(User.findOne).toHaveBeenCalledTimes(2);
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
    expect(User.create).toHaveBeenCalledWith({
      nif: req.body.nif,
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: 'hashed_senha'
    });
    expect(UserRoles.create).toHaveBeenCalledWith({ user_id: 3, user_type: "user" });
    expect(PhoneNumber.create).toHaveBeenCalledWith({
      phone_number: req.body.phone_number,
      phone_number_code: req.body.phone_number_code,
      user_id: 3
    });
    expect(Address.create).toHaveBeenCalledWith({
      street: req.body.street,
      door_number: req.body.door_number,
      floor_number: req.body.floor_number,
      city_id: req.body.city_id,
      owner_id: 3,
      owner_type: 'user'
    });
    expect(mockUser.save).toHaveBeenCalledTimes(2);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuario registrado com sucesso',
      user: {
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
        nif: '123456789',
        name: 'Teste',
        surname: 'Usuário',
        email: 'erro@email.com',
        password: 'senha',
        phone_number: '987654321',
        phone_number_code: '+244',
        street: 'Rua Principal',
        door_number: '10',
        floor_number: '2',
        city_id: 1,
      },
    };
    const res = createRes();

    User.findOne.mockRejectedValue(new Error('Erro no banco'));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro no Servidor' });
    
  });
});
