require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Order, Payment, PaymentMethod,PaymentStatus, Currency } = require('../../models');


//esta é uma forma segura e future proof🤔 e se os métodos de pagamento mudarem de nome?
exports.createPayment = async (req, res) => {
  try {
    //melhor pegar order id em body ou params🤔
    const { order_id, amount, currency_id, payment_method_id } = req.body;

    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    if (!amount || !currency_id || !payment_method_id) {
      return res.status(400).json({ message: "Faltam dados do pagamento." });
    }

    // Buscar a moeda (para saber o código: 'eur', 'cve', etc)
    const currency = await Currency.findByPk(currency_id);
    if (!currency) {
      return res.status(400).json({ message: "Moeda inválida." });
    }

    // Buscar o método de pagamento
    const paymentMethod = await PaymentMethod.findByPk(payment_method_id);
    if (!paymentMethod) {
      return res.status(400).json({ message: "Método de pagamento inválido." });
    }
    console.log("paymentMethod:", paymentMethod.name);

    let paymentStatusId;
    const paymentStatus = await PaymentStatus.findOne({
      where: {  name: paymentMethod.name === 'Cartão de Crédito' ? 'Pago' : 'Pendente', }, // Verifica o nome do método de pagamento

    });

    console.log("paymentStatusName:", paymentStatus.name);

    //console.log("paymentStatus:", paymentStatus.payment_status_id);

    paymentStatusId = paymentStatus.payment_status_id; // ID do status de pagamento

    if (!paymentStatusId) {
      return res.status(400).json({ message: "Status de pagamento inválido." });
    }
    


    // Se a moeda for CVE, converter para EUR para pagamento via Stripe
    let finalAmount = amount;
    let stripeCurrency = currency.currency_code.toLowerCase(); // exemplo: 'eur'
    console.log("finalAmount:", finalAmount);
    console.log("stripeCurrency:", stripeCurrency);

    if (stripeCurrency === 'cve') {
      const { convertCVEtoEUR } = require('../../utils/currencyConverter');
      finalAmount = convertCVEtoEUR(amount);
      stripeCurrency = 'eur'; // Stripe só aceita EUR
    }
    console.log("finalAmount after conversion:", finalAmount);

    let stripePaymentIntent = null;
    if (paymentMethod.name === 'Cartão de Crédito') {
      // Criar PaymentIntent no Stripe
      stripePaymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(finalAmount * 100), // em centavos
        currency: stripeCurrency,
      });
    }

    // Registar pagamento no banco de dados
    const payment = await Payment.create({
      amount: amount,
      payment_status_id: paymentStatusId,
      payment_method_id,
      currency_id,
    });

    // Atualizar o pedido com o payment_id gerado
    await order.update({ payment_id: payment.payment_id });

    // Atualizar o pedido com o pagamento
    await order.update({ payment_id: payment.payment_id });

    res.status(200).json({
      message: "Pagamento registrado!",
      clientSecret: stripePaymentIntent ? stripePaymentIntent.client_secret : null,
    });

  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    res.status(500).json({ error: "Erro ao processar pagamento." });
  }
};

