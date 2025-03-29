jest.mock('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/models', () => ({
  PostOffice: {
    findByPk: jest.fn()
  },
  PostOfficeUser: {
    update: jest.fn()
  }
}));

const { rejectPostOffice } = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/src/controllers/adminPanelController');
const { PostOffice, PostOfficeUser } = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/models');

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.clearAllMocks();
});

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Testes para a função rejectPostOffice', () => {
  test('Retorna erro 404 se o correio não for encontrado', async () => {
    const req = { params: { id: '1' } };
    const res = createRes();

    PostOffice.findByPk.mockResolvedValue(null);

    await rejectPostOffice(req, res);

    expect(PostOffice.findByPk).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Correio não encontrado!' });
  });

  test('Retorna erro 400 se o correio já foi rejeitado', async () => {
    const req = { params: { id: '1' } };
    const res = createRes();
    const mockPostOffice = { id: 1, rejected: true };

    PostOffice.findByPk.mockResolvedValue(mockPostOffice);

    await rejectPostOffice(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Este correio já foi rejeitado!' });
  });

  test('Rejeita o correio e desativa o administrador', async () => {
    const req = { params: { id: '1' } };
    const res = createRes();
    const mockPostOffice = { id: 1, is_active: true, rejected: false, save: jest.fn() };

    PostOffice.findByPk.mockResolvedValue(mockPostOffice);
    PostOfficeUser.update.mockResolvedValue([1]);

    await rejectPostOffice(req, res);

    expect(mockPostOffice.is_active).toBe(false);
    expect(mockPostOffice.rejected).toBe(true);
    expect(mockPostOffice.save).toHaveBeenCalled();
    expect(PostOfficeUser.update).toHaveBeenCalledWith(
      { is_active: false },
      { where: { post_office_id: '1' } }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Correio rejeitado com sucesso!', postOffice: mockPostOffice });
  });

  test('Retorna erro 500 em caso de exceção', async () => {
    const req = { params: { id: '1' } };
    const res = createRes();

    PostOffice.findByPk.mockRejectedValue(new Error('Erro no banco'));

    await rejectPostOffice(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao rejeitar correio!' });
  });
});
