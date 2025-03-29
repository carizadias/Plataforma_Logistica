jest.mock('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/models', () => ({
  PostOffice: {
    findByPk: jest.fn()
  }
}));

const { restorePostOffice } = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/src/controllers/adminPanelController');
const { PostOffice } = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/models');

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

describe('Testes para a função restorePostOffice', () => {
  test('Retorna erro 404 se o correio não for encontrado', async () => {
    const req = { params: { id: '1' } };
    const res = createRes();

    PostOffice.findByPk.mockResolvedValue(null);

    await restorePostOffice(req, res);

    expect(PostOffice.findByPk).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Correio não encontrado!' });
  });

  test('Retorna erro 400 se o correio já está restaurado', async () => {
    const req = { params: { id: '1' } };
    const res = createRes();
    const mockPostOffice = { id: 1, rejected: false };

    PostOffice.findByPk.mockResolvedValue(mockPostOffice);

    await restorePostOffice(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Este correio já está restaurado!' });
  });

  test('Restaura o correio corretamente e o mantém inativo', async () => {
    const req = { params: { id: '1' } };
    const res = createRes();
    const mockPostOffice = { id: 1, rejected: true, save: jest.fn() };

    PostOffice.findByPk.mockResolvedValue(mockPostOffice);

    await restorePostOffice(req, res);

    expect(mockPostOffice.rejected).toBe(false);
    expect(mockPostOffice.is_active).toBe(false);
    expect(mockPostOffice.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Correio restaurado com sucesso!', postOffice: mockPostOffice });
  });

  test('Retorna erro 500 em caso de exceção', async () => {
    const req = { params: { id: '1' } };
    const res = createRes();

    PostOffice.findByPk.mockRejectedValue(new Error('Erro no banco'));

    await restorePostOffice(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao restaurar correio!' });
  });
});
