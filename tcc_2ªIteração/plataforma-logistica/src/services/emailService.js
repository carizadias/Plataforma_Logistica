const nodemailer = require("nodemailer");
require("dotenv").config();
const { User, OrderRecipient, Recipient } = require('../../models');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendResetPasswordEmail = async (email, token) => {
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Recuperação de senha",
        text: `Clique no link para redefinir sua senha: ${resetLink}`,
        html: `<p> Clique no link abaixo para redefinir a sua senha:<p><a href="${resetLink}">${resetLink}</a>`,

    };

    await transporter.sendMail(mailOptions);
};

const sendOrderStatusNotification = async (order, status) => {
  const { sender_nif } = order;

  const sender = await getSenderByNif(sender_nif);
  if (!sender || !sender.email) {
    console.error("Email do remetente não encontrado.");
    return;
  }

  const senderEmail = sender.email;

  const recipient = await getRecipientByOrderId(order.order_id);
  if (!recipient || !recipient.email) {
    console.error("Email do destinatário não encontrado.");
    return;
  }

  const recipientEmail = recipient.email;

  const subject = `Status da sua encomenda #${order.order_id} alterado para: ${status}`;
  const text = `A encomenda com ID #${order.order_id} teve seu status alterado para "${status}".`;
  const html = `<p>A encomenda com ID #${order.order_id} teve seu status alterado para "<strong>${status}</strong>".</p>`;

  const senderMailOptions = {
    from: process.env.EMAIL_USER,
    to: senderEmail,
    subject: `Atualização sobre a sua encomenda #${order.order_id}`,
    text: `Olá, o status da sua encomenda com ID #${order.order_id} foi alterado para "${status}".`,
    html: `<p>Olá, o status da sua encomenda com ID #${order.order_id} foi alterado para "<strong>${status}</strong>".</p>`,
  };

  const recipientMailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: `Status da sua encomenda #${order.order_id}`,
    text: `A encomenda com ID #${order.order_id} que você está aguardando teve seu status alterado para "${status}".`,
    html: `<p>A encomenda com ID #${order.order_id} que você está aguardando teve seu status alterado para "<strong>${status}</strong>".</p>`,
  };

try {
  await transporter.sendMail(senderMailOptions);
  console.log(`Notificação de status enviada para o remetente: ${senderEmail}`);
} catch (error) {
  console.error("Erro ao enviar e-mail para o remetente:", error);
}

try {
  await transporter.sendMail(recipientMailOptions);
  console.log(`Notificação de status enviada para o destinatário: ${recipientEmail}`);
} catch (error) {
  console.error("Erro ao enviar e-mail para o destinatário:", error);
}
};


const getSenderByNif = async (nif) => {
  try {
    const sender = await User.findOne({ where: { nif } });
    return sender; 
  } catch (error) {
    console.error("Erro ao buscar remetente:", error);
    return null;
  }
};

const getRecipientByOrderId = async (orderId) => {
  try {
    const orderRecipient = await OrderRecipient.findOne({ where: { order_id: orderId } });
    if (!orderRecipient) {
      return null; 
    }

    const recipient = await Recipient.findOne({ where: { user_nif: orderRecipient.recipient_nif } });
    return recipient; 
  } catch (error) {
    console.error("Erro ao buscar destinatário:", error);
    return null;
  }
};

module.exports = {sendResetPasswordEmail, sendOrderStatusNotification};