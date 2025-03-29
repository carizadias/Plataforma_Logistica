jest.mock('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/models', () => ({
  PostOffice: {
    findByPk: jest.fn()
  },
  PostOfficeUser: {
    update: jest.fn(),
    findOne: jest.fn()
  }
}));

const { approvePostOffice } = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/src/controllers/adminPanelController');
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

describe('Testes para a função approvePostOffice', () => {
  test('Retorna erro 404 se o correio não for encontrado', async () => {
    const req = { params: { id: '1' } };
    const res = createRes();

    PostOffice.findByPk.mockResolvedValue(null);

    await approvePostOffice(req, res);

    expect(PostOffice.findByPk).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Correio não encontrado!' });
  });

  test('Retorna erro 400 se o correio já estiver ativo', async () => {
    const req = { params: { id: '1' } };
    const res = createRes();
    const mockPostOffice = { id: 1, is_active: true };

    PostOffice.findByPk.mockResolvedValue(mockPostOffice);

    await approvePostOffice(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Este correio já está ativo!' });
  });

  test('Aprova o correio e ativa o administrador', async () => {
    const req = { params: { id: '1' } };
    const res = createRes();
    const mockPostOffice = { id: 1, is_active: false, save: jest.fn() };
    const mockPostOfficeUser = { id: 1, post_office_id: 1, email: 'admin@example.com' };

    PostOffice.findByPk.mockResolvedValue(mockPostOffice);
    PostOfficeUser.update.mockResolvedValue([1]);
    PostOfficeUser.findOne.mockResolvedValue(mockPostOfficeUser);

    await approvePostOffice(req, res);

    expect(mockPostOffice.save).toHaveBeenCalled();
    expect(PostOfficeUser.update).toHaveBeenCalledWith(
      { is_active: true },
      { where: { post_office_id: '1' } }
    );
    expect(PostOfficeUser.findOne).toHaveBeenCalledWith({
      where: { post_office_id: '1' },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Correio aprovado com sucesso! Administrador também ativado.',
      postOffice: mockPostOffice,
      postOfficeUser: mockPostOfficeUser
    });
  });

  test('Retorna erro 500 em caso de exceção', async () => {
    const req = { params: { id: '1' } };
    const res = createRes();

    PostOffice.findByPk.mockRejectedValue(new Error('Erro no banco'));

    await approvePostOffice(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao aprovar correio!' });
  });
});
