const { Order, User, OrderRecipient,OrderStatus } = require('../../models');
const { createOrderSchema } = require('../validators/orderValidator');
const { createOrder } = require('../services/orderService');
const orderDetailsService = require('../services/orderDetailsService');
const { sendOrderStatusNotification } = require('../services/emailService')

//excluir c e u de resposta
exports.createOrder = async (req, res) => {
  try {
    const { error } = createOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.user.user_id;

    const newOrder = await createOrder(req.body, userId);

    res.status(201).json({ message: 'Pedido de entrega criado com sucesso!', order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Erro ao criar pedido' });
  }
};

exports.getOrderHistory = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const orders = await Order.findAll({
      where: { sender_id: userId },
      attributes: ['description'],
      include: [
        {
          model: OrderRecipient,
          as: 'recipients',
          include: [
            {
              model: User,
              as: 'recipient',
              attributes: ['name', 'surname'],
            }
          ]
        }
      ]
    });

    const formattedHistory = orders.flatMap(order => 
      order.recipients.map(({ recipient }) => ({
        name: recipient.name,
        surname: recipient.surname,
        description: order.description,
      }))
    );

    return res.status(200).json({ history: formattedHistory });

  } catch (error) {
    console.error('Erro ao buscar histórico de ordens:', error);
    return res.status(500).json({
      message: 'Erro interno do servidor',
      error: error.message,
    });
  }
};

exports.getReceivedOrderHistory = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['name', 'surname'], // Somente nome e sobrenome do destinatário
        },
        {
          model: OrderRecipient,
          as: 'recipients',
          where: { recipient_id: userId }, // Filtra apenas as orders em que o usuário é destinatário
          required: true,
          include:[
            {
              model: User,
              as: 'recipient',
              attributes: ['name', 'surname'],
            }
          ],
          attributes: [], // Inclui também o nome e sobrenome do remetente
        }
      ],
      attributes: ['description'], // Inclui a descrição da order
    });

    // Formatar a resposta para exibir uma lista clara de { senderName, senderSurname, description }
    const formattedHistory = orders.map(order => ({
      senderName: order.sender.name,
      senderSurname: order.sender.surname,
      description: order.description
    }));

    return res.status(200).json({ history: formattedHistory });

  } catch (error) {
    console.error('Erro ao buscar histórico de ordens recebidas:', error);
    return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};

//pode ser usado ambos sender e recipient basta dar o id do pedido
//tirar c e u de resposta
exports.getOrderDetails = async function (req, res) {//pq async function aqui?
  const { id } = req.params;

  try {
    const order = await orderDetailsService.getOrderDetailsById(id);
    res.status(200).json(order);
  } catch (error) {
    console.error('Erro ao buscar detalhes do pedido:', error);
    res.status(404).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_status_id } = req.body;

    if (!new_status_id) {
      return res.status(400).json({ message: "Novo status não fornecido." });
    }

    const validStatus = await OrderStatus.findByPk(new_status_id);
    if (!validStatus) {
      return res.status(400).json({ message: "Status inválido fornecido." });
    }

    const order = await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['user_id', 'name', 'surname', 'email']
        },
        {
          model: OrderRecipient,
          as: 'recipients',
          include: [
            {
              model: User,
              as: 'recipient', // alias usado no modelo OrderRecipient
              attributes: ['user_id', 'name', 'surname', 'email']
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    //const previousStatus = order.order_status_id;
    const previousStatusRecord = await OrderStatus.findByPk(order.order_status_id);
    const previousStatusName = previousStatusRecord ? previousStatusRecord.name : order.order_status_id;


    // Atualiza o status e salva
    order.order_status_id = new_status_id;
    await order.save();

    const newStatusName = validStatus.name;

    // Envia notificação para todos os envolvidos
    await sendOrderStatusNotification(order, newStatusName);

    res.status(200).json({
      message: `Status do pedido atualizado com sucesso de "${previousStatusName}" para "${newStatusName}".`,
      order
    });//todas as respostas nesta estrutura?

  } catch (error) {
    console.error("Erro ao atualizar o status do pedido:", error);
    res.status(500).json({
      error: "Erro interno no servidor. Verifique se o token está expirado."
    });
  }
};
