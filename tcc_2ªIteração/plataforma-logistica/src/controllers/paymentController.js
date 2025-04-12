require('dotenv').config();
const { Order, Payment } = require('../../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const feeService = require('../services/feeService');



exports.createPaymentIntent = async (req, res) => {
  try {
    const { order_id, amount, currency, payment_method_id } = req.body;

    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    if (!amount || !currency) {
      return res.status(400).json({ message: "Informe o valor e a moeda." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      payment_method_types: ['card'],
    });

    const payment = await Payment.create({
      amount,
      payment_status_id: 1,
      payment_method_id: payment_method_id || null,
    });

    await order.update({ payment_id: payment.payment_id });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      message: "Pagamento registrado no banco de dados!",
    });

  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    res.status(500).json({ error: "Erro ao processar pagamento." });
  }
};


exports.calculateFee = async (req, res) => {
  try {
    const { sub_service_id, order_type_id, destination, weight } = req.query;

    if (!sub_service_id || !order_type_id || !destination || isNaN(weight)) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios e o peso deve ser numérico." });
    }

    console.log("req.query"+req.query)

    const price = await feeService.calculateFee({
      sub_service_id,
      order_type_id,
      weight: parseFloat(weight),
      destination
    });

    console.log("price:"+price)

    return res.status(200).json({ price });

  } catch (error) {
    console.error("Erro ao calcular preço:", error.message);
    return res.status(404).json({ message: error.message });
  }
};
