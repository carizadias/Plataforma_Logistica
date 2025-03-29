const { updateProfilePicture } = require('../../src/controllers/profileController');
const { User } = require('../../models'); 
const fs = require('fs');
const path = require('path');

jest.mock('fs');
jest.mock('path');
jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn(),
  },
}));

describe('updateProfilePicture', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: { id: '1' },
      file: { filename: 'novaImagem.png', originalname: 'imagem.png', mimetype: 'image/png' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test('retorna 400 se nenhuma imagem for enviada', async () => {
    req.file = undefined;

    await updateProfilePicture(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Nenhuma imagem foi enviada.' });
  });

  test('retorna 404 se usuário não for encontrado', async () => {
    User.findByPk.mockResolvedValue(null);

    await updateProfilePicture(req, res);

    expect(User.findByPk).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário não encontrado.' });
  });

  test('remove imagem antiga se existir, atualiza e retorna 200', async () => {
    const fakeUser = {
      user_id: '1',
      profile_picture: 'imagemAntiga.png',
      save: jest.fn().mockResolvedValue(true),
    };

    User.findByPk.mockResolvedValue(fakeUser);

    const oldImagePath = '/uploads/profile_pictures/imagemAntiga.png';
    path.join.mockReturnValue(oldImagePath);

    fs.existsSync.mockReturnValue(true);

    await updateProfilePicture(req, res);

    expect(fs.existsSync).toHaveBeenCalledWith(oldImagePath);
    expect(fs.unlinkSync).toHaveBeenCalledWith(oldImagePath);

    expect(fakeUser.profile_picture).toBe('novaImagem.png');
    expect(fakeUser.save).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Imagem de perfil atualizada com sucesso!',
      profile_picture: 'novaImagem.png',
    });
  });

  test('não tenta remover imagem antiga se não existir, atualiza e retorna 200', async () => {
    const fakeUser = {
      user_id: '1',
      profile_picture: 'imagemAntiga.png',
      save: jest.fn().mockResolvedValue(true),
    };

    User.findByPk.mockResolvedValue(fakeUser);

    const oldImagePath = '/uploads/profile_pictures/imagemAntiga.png';
    path.join.mockReturnValue(oldImagePath);

    fs.existsSync.mockReturnValue(false);

    await updateProfilePicture(req, res);

    expect(fs.existsSync).toHaveBeenCalledWith(oldImagePath);
    expect(fs.unlinkSync).not.toHaveBeenCalled();

    expect(fakeUser.profile_picture).toBe('novaImagem.png');
    expect(fakeUser.save).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Imagem de perfil atualizada com sucesso!',
      profile_picture: 'novaImagem.png',
    });
  });

  test('captura erro e retorna 500 se ocorrer uma exceção', async () => {
    const error = new Error('Erro interno');
    User.findByPk.mockRejectedValue(error);

    await updateProfilePicture(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar a imagem de perfil.' });
  });
});
