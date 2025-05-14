const { Order, User, OrderRecipient, Payment, PostOffice, OrderType, DeliveryType, OrderStatus } = require('../../models');
const { generateTrackingCode } = require('../../utils/trackingGenerator');
//ñ ficava melhor como util?
async function createOrder(data, senderId) {
  const {
    order_type_id, height, width, weight, payment_id, send_date,
    post_office_id, description, delivery_type_id, delivery_date,
    current_status, order_status_id, recipient_ids
  } = data;

  console.log("Dados do pedido:", data);

  // Validar entidades relacionadas
  const [payment, postOffice, orderType] = await Promise.all([
    Payment.findOne({ where: { payment_id } }),
    PostOffice.findOne({ where: { post_office_id } }),
    OrderType. findOne({ where: { order_type_id } })
  ]);
  console.log("payment:", payment);

  if (!orderType) {
    throw new Error('Tipo pedido, inválido');
  }

  if (!postOffice) {
    throw new Error('Correio, inválido');
  }

  if (!payment) {
    throw new Error('Pagamento, inválido');
  }
  

  let deliveryType = null;
  if (delivery_type_id) {
    deliveryType = await DeliveryType.findOne({ where: { delivery_type_id } });
    if (!deliveryType) {
      throw new Error('Tipo de entrega inválido');
    }
  }

  const tracking_code = generateTrackingCode();

  const newOrder = await Order.create({
    sender_id: senderId,
    order_type_id,
    height,
    width,
    weight,
    payment_id:null,
    send_date,
    post_office_id,
    description,
    tracking_code,
    delivery_type_id,
    delivery_date: delivery_date || null,
//    current_status: current_status || 'Pendente',
    order_status_id:1 // 'Pendente'
  });

  const status = await OrderStatus.findByPk(1);
  if (!status) throw new Error("Status 'Pending' não encontrado.");


  for (const recipient_id of recipient_ids) {
    let recipient = await User.findByPk(recipient_id);

    if (!recipient) {
      //const userInfo = await User.findOne({ where: { nif: recipient_nif } });
//      if (!recipient) {
        throw new Error(`Destinatário com ID ${recipient_id} não encontrado`);
      }

      // recipient = await Recipient.create({
      //   user_nif: userInfo.nif,
      //   name: userInfo.name,
      //   surname: userInfo.surname,
      //   email: userInfo.email,
      //   address_id: userInfo.address_id,
      //   phone_number_id: userInfo.phone_number_id
      // });

    await OrderRecipient.create({
      order_id: newOrder.order_id,
      recipient_id: recipient.user_id
    });
  }

  return newOrder;
}

module.exports = { createOrder };
