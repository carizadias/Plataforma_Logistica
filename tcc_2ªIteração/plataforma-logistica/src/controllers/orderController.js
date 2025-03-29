const jwt = require('jsonwebtoken');
const { Order, User, Recipient, OrderRecipient, Payment, PostOffice, OrderType, DeliveryType } = require('../../models');
const { sendOrderStatusNotification } = require('../services/emailService')

exports.createOrder = async (req, res) => {
  try {
    const {
      sender_nif,
      order_type_id,
      height,
      width,
      weight,
      payment_id,
      send_date,
      post_office_id,
      description,
      delivery_type_id,
      delivery_date,
      current_status,
      order_status_id,
      recipient_nifs
    } = req.body;

    if (!order_type_id || !height || !width || !weight || !payment_id || !send_date || !post_office_id || !recipient_nifs || !recipient_nifs.length === 0) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_Secret);
    const { nif } = decoded;

    const payment = await Payment.findOne({ where: { payment_id } });
    if (!payment) {
      return res.status(400).json({ message: 'Pagamento inválido' });
    }

    const postOffice = await PostOffice.findOne({ where: { post_office_id } });
    if (!postOffice) {
      return res.status(400).json({ message: 'Posto de correios inválido' });
    }

    const orderType = await OrderType.findOne({ where: { order_type_id } });
    if (!orderType) {
      return res.status(400).json({ message: 'Tipo de pedido inválido' });
    }

    const deliveryType = delivery_type_id ? await DeliveryType.findOne({ where: { delivery_type_id } }) : null;
    if (delivery_type_id && !deliveryType) {
      return res.status(400).json({ message: 'Tipo de entrega inválido' });
    }

    const tracking_code = `TRK-${Date.now()}`;

    const newOrder = await Order.create({
      sender_nif: nif,
      order_type_id,
      height,
      width,
      weight,
      payment_id,
      send_date,
      post_office_id,
      description,
      tracking_code,
      delivery_type_id,
      delivery_date: delivery_date || null,
      current_status: current_status || 'Pendente',
      order_status_id
    });

    for (const recipient_nif of recipient_nifs) {
      let recipient = await Recipient.findOne({ where: { user_nif: recipient_nif } });

      if (!recipient) {
        const userInfo = await User.findOne({ where: { nif: recipient_nif } });
        if (userInfo) {
          recipient = await Recipient.create({
            user_nif: userInfo.nif,
            name: userInfo.name,
            surname: userInfo.surname,
            email: userInfo.email,
            address_id: userInfo.address_id,
            phone_number_id: userInfo.phone_number_id
          });
        } else {
          return res.status(400).json({ message: `Destinatário ${recipient_nif} não encontrado.` });
        }
      }

      await OrderRecipient.create({
        order_id: newOrder.order_id,
        recipient_nif: recipient.user_nif,
      });
    }

    res.status(201).json({ message: 'Pedido de entrega criado com sucesso!', order: newOrder, recipient_nifs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar pedido de entrega' });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_Secret);
    const { nif } = decoded;

    if (!nif) {
        return res.status(403).json({ message: 'Acesso negado. Apenas usuários comuns podem consultar o histórico.' });
    }

    const user = await User.findOne({ where: { nif } });
    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const orders = await Order.findAll({ where: { sender_nif: nif }, attributes: ['description'], include: [{ model: Recipient, through: OrderRecipient, attributes: ['name', 'surname'] }] });

    res.status(200).json({ message: 'Histórico de encomendas recuperado com sucesso!', orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao recuperar histórico de encomendas.' });
  }
};


exports.getOrderHistoryForRecipient = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }


    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    const userNif = decoded.nif;

    const user = await User.findOne({ where: { nif: userNif } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const orders = await Order.findAll({
      include: {
        model: Recipient,
        through: { model: OrderRecipient, where: { recipient_nif: userNif } },
        required: true, 
      }
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Nenhuma encomenda encontrada para este destinatário.' });
    }

    res.status(200).json({ message: 'Encomendas recuperadas com sucesso!', orders });
  } catch (error) {
    console.error('Erro ao recuperar encomendas:',error);
    res.status(500).json({ error: 'Erro ao recuperar as encomendas.' });
  }
};

exports.getOrderHistoryDetails = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');


    const decoded = jwt.verify(token, process.env.JWT_Secret);
    const { nif } = decoded;

    const { order_id } = req.params;
    if (!order_id) {
      return res.status(400).json({ message: 'ID do pedido não fornecido' });
    }

    const order = await Order.findOne({
      where: { sender_nif: nif, order_id },
      include: [
        { model: Recipient, through: OrderRecipient, attributes: ['name', 'surname'] }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.status(200).json({ message: 'Histórico de encomendas recuperado com sucesso!', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao recuperar histórico de encomendas.' });
  }
};

exports.getOrderHistoryDetailsForRecipient = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_Secret); 
    const userNif = decoded.nif;

    const { order_id } = req.params;
    if (!order_id) {
      return res.status(400).json({ message: 'ID do pedido não fornecido' });
    }

    const order = await Order.findOne({
      where: { order_id },
      include: {
        model: Recipient,
        through: { model: OrderRecipient, where: { recipient_nif: userNif } },
        required: true,
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado ou o usuário não é o destinatário deste pedido.' });
    }

    res.status(200).json({ message: 'Detalhes da encomenda recuperados com sucesso!', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao recuperar os detalhes da encomenda.' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { current_status } = req.body;

    if (!current_status) {
      return res.status(400).json({ message: "Status atual não fornecido." });
    }

    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    const previousStatus = order.current_status; 
    order.current_status = current_status;
    await order.save();

    await sendOrderStatusNotification(order, current_status);

    res.status(200).json({ message: "Status do pedido atualizado com sucesso.", order });
  } catch (error) {
    console.error("Erro ao atualizar o status do pedido:", error);
    res.status(500).json({ error: "Erro interno no servidor, verifique se o token esta expirado" });
  }
};

exports.getOrdersByPostOffice = async (req, res) => {
  try {
    const postOfficeId = req.params.post_office_id;

    if (!postOfficeId) {
      return res.status(400).json({ message: 'Parâmetro post_office_id não fornecido' });
    }

    const orders = await Order.findAll({
      where: { post_office_id: postOfficeId },
      attributes: ['order_id', 'current_status', 'sender_nif', 'tracking_code', 'send_date']
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Nenhuma encomenda encontrada para este posto de correios' });
    }

    res.status(200).json({
      message: 'Encomendas recuperadas com sucesso!',
      orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao recuperar encomendas.' });
  }
};
