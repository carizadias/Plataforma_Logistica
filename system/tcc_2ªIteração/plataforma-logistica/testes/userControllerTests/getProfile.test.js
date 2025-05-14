const { getProfile } = require('plataforma-logistica/src/controllers/userController'); 
const { User } = require('plataforma-logistica/models'); 
jest.mock('plataforma-logistica/models', () => ({
  User: {
    findOne: jest.fn(),
  },
}));

describe('getProfile', () => {
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
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('retorna 404 se usuário não for encontrado', async () => {
    User.findOne.mockResolvedValue(null);

    await getProfile(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { nif: '123456789' },
      attributes: { exclude: ['password', 'resetToken', 'resetTokenExpire', 'is_active'] },
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
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário comum não encontrado' });
  });

  test('retorna 200 com o usuário se encontrado', async () => {
    const fakeUser = {
      nif: '123456789',
      name: 'Maria',
      surname: 'Silva',
      profile_picture: 'foto.png',
    };

    User.findOne.mockResolvedValue(fakeUser);

    await getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ user: fakeUser });
  });

  test('captura erro e retorna 500 se ocorrer uma exceção', async () => {
    const error = new Error('Erro de teste');
    User.findOne.mockRejectedValue(error);

    await getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar usuário' });
  });
});
