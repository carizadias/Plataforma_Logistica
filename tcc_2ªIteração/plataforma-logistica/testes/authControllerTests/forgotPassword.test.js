jest.mock('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/models', () => ({
  User: {
    findOne: jest.fn()
  }
}));

jest.mock('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/src/services/emailService.js', () => ({
  sendResetPasswordEmail: jest.fn()
}));

const crypto = require('crypto');
const { forgotPassword } = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/src/controllers/authController.js');
const { User } = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/models');
const { sendResetPasswordEmail } = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/src/services/emailService.js');

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Testes para a função forgotPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Retorna erro 404 se o e-mail não for encontrado', async () => {
    const req = { body: { email: 'notfound@example.com' } };
    const res = createRes();

    User.findOne.mockResolvedValue(null);

    await forgotPassword(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'E-mail não encontrado' });
  });

  test('Envia e-mail de recuperação quando o usuário é encontrado', async () => {
    const req = { body: { email: 'user@example.com' } };
    const res = createRes();
    const mockUser = {
      email: req.body.email,
      update: jest.fn()
    };

    User.findOne.mockResolvedValue(mockUser);
    sendResetPasswordEmail.mockResolvedValue(true);

    await forgotPassword(req, res);

    expect(mockUser.update).toHaveBeenCalled();
    expect(sendResetPasswordEmail).toHaveBeenCalledWith(req.body.email, expect.any(String));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email de recuperação enviado com sucesso', token: expect.any(String) });
  });

  test('Retorna erro 500 em caso de exceção', async () => {
    const req = { body: { email: 'error@example.com' } };
    const res = createRes();

    User.findOne.mockRejectedValue(new Error('Erro no banco'));

    await forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao processar solicitação' });
  });
});
