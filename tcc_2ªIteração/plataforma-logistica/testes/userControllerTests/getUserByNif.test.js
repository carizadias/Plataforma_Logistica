const { getUserByNIF } = require('../../src/controllers/userController'); 
const { User } = require('../../models');

jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn(),
  },
}));

describe('getUserByNIF', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: { nif: '123456789' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test('retorna 404 se usuário não for encontrado', async () => {
    User.findOne.mockResolvedValue(null);

    await getUserByNIF(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { nif: '123456789' },
      attributes: ['name', 'surname', 'profile_picture'],
      include: [
        expect.objectContaining({
          as: "roles",
          attributes: ['name'],
          where: { name: 'user' },
          through: { attributes: [] }
        })
      ]
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário não encontrado' });
  });

  test('retorna 200 com o usuário se encontrado', async () => {
    const fakeUser = {
      name: 'João',
      surname: 'Silva',
      profile_picture: 'foto.png',
    };

    User.findOne.mockResolvedValue(fakeUser);

    await getUserByNIF(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ user: fakeUser });
  });

  test('captura erro e retorna 500 se ocorrer uma exceção', async () => {
    const error = new Error('Erro de teste');
    User.findOne.mockRejectedValue(error);

    await getUserByNIF(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar usuário' });
  });
});
