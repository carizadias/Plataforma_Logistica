jest.mock('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/models', () => ({
  PostOffice: {
    findAll: jest.fn()
  }
}));

const { getPendingPostOffices } = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/src/controllers/adminPanelController');
const { PostOffice } = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/models');

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Testes para a função getPendingPostOffices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Retorna lista de correios pendentes com sucesso', async () => {
    const req = {};
    const res = createRes();
    const mockPendingPostOffices = [
      { id: 1, name: 'Posto 1', is_active: false, rejected: false },
      { id: 2, name: 'Posto 2', is_active: false, rejected: false }
    ];

    PostOffice.findAll.mockResolvedValue(mockPendingPostOffices);

    await getPendingPostOffices(req, res);

    expect(PostOffice.findAll).toHaveBeenCalledWith({ where: { is_active: false, rejected: false } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: mockPendingPostOffices });
  });

  test('Retorna erro 500 em caso de exceção', async () => {
    const req = {};
    const res = createRes();

    PostOffice.findAll.mockRejectedValue(new Error('Erro no banco'));

    await getPendingPostOffices(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar correios pendentes!' });
  });
});
