const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { resetPassword } = require('plataforma-logistica/src/controllers/authController.js');
const { User } = require('plataforma-logistica/models');

jest.mock('plataforma-logistica/models', () => ({
    User: {
        findOne: jest.fn()
    }
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

describe('Testes para a função resetPassword', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Retorna erro 400 se o token for inválido ou expirado', async () => {
        const req = { body: { token: 'invalid-token', newPassword: 'newpassword123' } };
        const res = createRes();

        User.findOne.mockResolvedValue(null);

        await resetPassword(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            where: {
                resetToken: req.body.token,
                resetTokenExpire: { [Op.gt]: expect.any(Date) },
            },
        });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido ou expirado' });
    });

    test('Redefine a senha quando o token é válido', async () => {
        const req = { body: { token: 'valid-token', newPassword: 'newpassword123' } };
        const res = createRes();
        const mockUser = {
            update: jest.fn()
        };

        User.findOne.mockResolvedValue(mockUser);
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');

        await resetPassword(req, res);

        expect(mockUser.update).toHaveBeenCalledWith({
            password: 'hashedpassword',
            resetToken: null,
            resetTokenExpire: null
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Senha redefinida com sucesso' });
    });

    test('Retorna erro 500 em caso de exceção', async () => {
        const req = { body: { token: 'error-token', newPassword: 'newpassword123' } };
        const res = createRes();

        User.findOne.mockRejectedValue(new Error('Erro no banco'));

        await resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao redifinir senha' });
    });
});
