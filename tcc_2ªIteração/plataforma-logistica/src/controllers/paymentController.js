require('dotenv').config();
const { Order, Payment } = require('../../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require("../config/database");


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
    const { subservice_id, order_type_id, destination } = req.query;
    const weight = Number(req.query.weight);

    if (!subservice_id || !order_type_id || isNaN(weight) || !destination) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const priceColumn = destination.toLowerCase() === "nacional" ? "price_national" : "price_international";

    const rows = await db.query(
      `SELECT ${priceColumn} AS price FROM fees 
          WHERE subservice_id = :subservice_id 
          AND order_type_id = :order_type_id 
          AND :weight BETWEEN weight_min AND weight_max 
          LIMIT 1`,
      {
        replacements: {
          subservice_id,
          order_type_id,
          weight
        },
        type: db.QueryTypes.SELECT
      }
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Nenhuma tarifa encontrada para os critérios informados." });
    }

    res.status(200).json({ price: rows[0].price });

  } catch (error) {
    console.error("Erro ao calcular preço:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};