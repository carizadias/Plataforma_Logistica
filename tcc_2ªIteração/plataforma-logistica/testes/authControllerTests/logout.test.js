const { logout } = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/src/controllers/authController.js');
const blacklistedTokens = require('../../utils/tokenBlacklist');

jest.mock('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/utils/tokenBlacklist', () => ({
  add: jest.fn()
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Testes para a função logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Retorna erro 400 se o token não for fornecido', async () => {
    const req = { header: jest.fn().mockReturnValue(null) };
    const res = createRes();

    await logout(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Token não fornecido" });
  });

  test('Realiza logout com sucesso e adiciona o token à blacklist', async () => {
    const mockToken = "mocked_token";
    const req = { header: jest.fn().mockReturnValue(`Bearer ${mockToken}`) };
    const res = createRes();

    await logout(req, res);

    expect(blacklistedTokens.add).toHaveBeenCalledWith(mockToken);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Logout realizado com sucesso" });
  });
});
