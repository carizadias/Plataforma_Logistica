const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');

jest.mock('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/src/config/database.js', () => ({
  query: jest.fn(),
  QueryTypes: { SELECT: 'SELECT' }
}));

jest.mock('../../models', () => ({
  PostOfficeUser: {
    findByPk: jest.fn()
  }
}));

const db = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/src/config/database.js');
const { PostOfficeUser } = require('../../models');

describe('POST /api/post_offices/add_or_update_fee', () => {
  let token;
  let adminUser;
  let nonAdminUser;
  
  const feeData = {
    order_type_id: 1,
    subservice_id: 2,
    weight_min: 10,
    weight_max: 20,
    price_national: 100,
    price_international: 200
  };

  beforeEach(() => {
    jest.clearAllMocks();
    token = jwt.sign({ id: 1, user_id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    adminUser = {
      id: 1,
      is_active: true,
      getRoles: jest.fn().mockResolvedValue([{ name: 'admin' }])
    };

    nonAdminUser = {
      id: 2,
      is_active: true,
      getRoles: jest.fn().mockResolvedValue([{ name: 'user' }])
    };
  });

  it('deve retornar 401 se o token não for fornecido', async () => {
    const res = await request(app)
      .post('/api/post_offices/add_or_update_fee')
      .send(feeData);
    
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token não fornecido');
  });

  it('deve retornar 403 se o usuário não for admin', async () => {
    const invalidToken = jwt.sign({ id: 2, user_id: 2 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    PostOfficeUser.findByPk.mockResolvedValue(nonAdminUser);

    const res = await request(app)
      .post('/api/post_offices/add_or_update_fee')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(feeData);

    expect(res.status).toBe(403);
    expect(res.body.message).toContain('Acesso negado');
  });

  it('deve retornar 400 se algum campo obrigatório estiver ausente', async () => {
    PostOfficeUser.findByPk.mockResolvedValue(adminUser);

    const incompleteData = { ...feeData };
    delete incompleteData.price_international;

    const res = await request(app)
      .post('/api/post_offices/add_or_update_fee')
      .set('Authorization', `Bearer ${token}`)
      .send(incompleteData);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Todos os campos são obrigatórios.");
  });

  it('deve atualizar a tarifa se ela existir', async () => {
    PostOfficeUser.findByPk.mockResolvedValue(adminUser);
    
    const existingFee = { fee_id: 10 };
    db.query.mockResolvedValueOnce([existingFee]); 
    db.query.mockResolvedValueOnce(); 

    const res = await request(app)
      .post('/api/post_offices/add_or_update_fee')
      .set('Authorization', `Bearer ${token}`)
      .send(feeData);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Tarifa atualizada com sucesso.");
    
    expect(db.query).toHaveBeenNthCalledWith(1,
      expect.stringContaining('SELECT * FROM fees'),
      expect.objectContaining({
        replacements: {
          order_type_id: feeData.order_type_id,
          subservice_id: feeData.subservice_id,
          weight_min: feeData.weight_min
        },
        type: db.QueryTypes.SELECT
      })
    );
    
    expect(db.query).toHaveBeenNthCalledWith(2,
      expect.stringContaining('UPDATE fees SET price_national'),
      expect.objectContaining({
        replacements: {
          price_national: feeData.price_national,
          price_international: feeData.price_international,
          fee_id: existingFee.fee_id
        }
      })
    );
  });

  it('deve inserir uma nova tarifa se ela não existir', async () => {
    PostOfficeUser.findByPk.mockResolvedValue(adminUser);
    
    db.query.mockResolvedValueOnce([]); 
    db.query.mockResolvedValueOnce(); 

    const res = await request(app)
      .post('/api/post_offices/add_or_update_fee')
      .set('Authorization', `Bearer ${token}`)
      .send(feeData);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Tarifa inserida com sucesso.");
    
    expect(db.query).toHaveBeenNthCalledWith(2,
      expect.stringContaining('INSERT INTO fees'),
      expect.objectContaining({
        replacements: feeData
      })
    );
  });

  it('deve retornar 500 em caso de erro interno', async () => {
    PostOfficeUser.findByPk.mockResolvedValue(adminUser);
    db.query.mockRejectedValue(new Error("Erro inesperado"));

    const res = await request(app)
      .post('/api/post_offices/add_or_update_fee')
      .set('Authorization', `Bearer ${token}`)
      .send(feeData);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Erro interno do servidor");
  });
});
