jest.mock('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/src/config/database.js', () => ({
    query: jest.fn(),
    QueryTypes: {
      SELECT: 'SELECT'
    }
  }));
  
const db = require('C:/Users/Administrador/OneDrive/Desktop/tcc_2ªIteração/plataforma-logistica/src/config/database.js');
  
const request = require('supertest');
const app = require('../../app');


describe('GET /api/payments/calculate_cost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  db.query.mockImplementation((sql, options) => {
    console.log('db.query chamado com:', sql, options);
    return Promise.resolve([]);
  });
  
  
  it('deve retornar 400 se algum parâmetro obrigatório estiver ausente', async () => {
    const res = await request(app)
      .get('/api/payments/calculate_cost')
      .query({
        order_type_id: '1',
        weight: '10',
        destination: 'nacional'
      });
      
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Todos os campos são obrigatórios.");
  });
  
  it('deve retornar 404 se nenhuma tarifa for encontrada para os critérios informados', async () => {
    db.query.mockResolvedValue([]);
    
    const res = await request(app)
      .get('/api/payments/calculate_cost')
      .query({
        subservice_id: '2',
        order_type_id: '1',
        weight: '10',
        destination: 'internacional'
      });
      
    expect(db.query).toHaveBeenCalled();
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Nenhuma tarifa encontrada para os critérios informados.");
  });
  
  it('deve retornar 200 e o preço se a tarifa for encontrada para destino nacional', async () => {
    const fakeFee = [{ price: 150 }];
    db.query.mockResolvedValue(fakeFee);
    
    const res = await request(app)
      .get('/api/payments/calculate_cost')
      .query({
        subservice_id: '2',
        order_type_id: '1',
        weight: '5',
        destination: 'nacional'
      });
      
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('price_national AS price'),
      expect.objectContaining({
        replacements: {
          subservice_id: '2',
          order_type_id: '1',
          weight: 5
        },
        type: 'SELECT'
      })
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ price: 150 });
  });
  
  it('deve retornar 200 e o preço se a tarifa for encontrada para destino internacional', async () => {
    const fakeFee = [{ price: 200 }];
    db.query.mockResolvedValue(fakeFee);
    
    const res = await request(app)
      .get('/api/payments/calculate_cost')
      .query({
        subservice_id: '3',
        order_type_id: '2',
        weight: '20',
        destination: 'internacional'
      });
      
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('price_international AS price'),
      expect.objectContaining({
        replacements: {
          subservice_id: '3',
          order_type_id: '2',
          weight: 20
        },
        type: 'SELECT'
      })
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ price: 200 });
  });
  
  it('deve retornar 500 em caso de erro inesperado', async () => {
    db.query.mockRejectedValue(new Error('Erro no banco'));
    
    const res = await request(app)
      .get('/api/payments/calculate_cost')
      .query({
        subservice_id: '2',
        order_type_id: '1',
        weight: '10',
        destination: 'nacional'
      });
      
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Erro interno do servidor");
  });
});
