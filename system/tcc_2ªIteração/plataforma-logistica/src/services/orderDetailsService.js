const { OrderRecipient, Order, User, OrderType, DeliveryType, OrderStatus, Payment, PostOffice, PaymentMethod, PaymentStatus } = require('../../models');
//ñ ficaria melhor em utils?
async function getOrderDetailsById(orderId) {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: OrderRecipient,
        as: 'recipients',
        include: [
          {
            model: User,
            as: 'recipient', // este alias está definido no modelo OrderRecipient
            attributes: ['user_id', 'name', 'surname', 'email']
          }
        ]
      },      
      {
        model: User,
        as: 'sender',
        attributes: ['user_id', 'name', 'surname', 'email']
      },
      {
        model: OrderType,
        as: 'orderType',
        attributes: ['order_type_id', 'name']
      },
      {
        model: DeliveryType,
        as: 'deliveryType',
        attributes: ['delivery_type_id', 'name']
      },
      {
        model: OrderStatus,
        as: 'status',
        attributes: ['order_status_id', 'name']
      },
      {
        model: Payment,
        as: 'payment',
        include: [
          {
            model: PaymentMethod,
            as: 'method',
            attributes: ['payment_method_id', 'name']
          },
          {
            model: PaymentStatus,
            as: 'status',
            attributes: ['payment_status_id', 'name']
          }
        ],
        attributes: ['payment_id', 'amount']
      },
      {
        model: PostOffice,
        as: 'postOffice',
        attributes: ['post_office_id', 'name']
      }
    ]
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
}

module.exports = {
  getOrderDetailsById
};
