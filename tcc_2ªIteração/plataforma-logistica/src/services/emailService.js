const nodemailer = require("nodemailer");
require("dotenv").config();

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
  const { order_id, sender, recipients } = order;

  if (!sender || !sender.email) {
    console.error("Email do remetente não encontrado.");
    return;
  }

  const subject = `Status da sua encomenda #${order_id} alterado para: ${status}`;
  const senderText = `Olá, o status da sua encomenda com ID #${order_id} foi alterado para "${status}".`;
  const senderHtml = `<p>Olá, o status da sua encomenda com ID #${order_id} foi alterado para "<strong>${status}</strong>".</p>`;

  // E-mail para o remetente
  const senderMailOptions = {
    from: process.env.EMAIL_USER,
    to: sender.email,
    subject: `Atualização sobre a sua encomenda #${order_id}`,
    text: senderText,
    html: senderHtml,
  };

  try {
    await transporter.sendMail(senderMailOptions);
    console.log(`Notificação enviada ao remetente: ${sender.email}`);
  } catch (error) {
    console.error("Erro ao enviar e-mail para o remetente:", error);
  }

  // Enviar e-mail para cada destinatário
  for (const recipient of recipients) {
    if (!recipient.email) {
      console.warn(`Destinatário ${recipient.user_id} sem e-mail. Pulando...`);
      continue;
    }

    const recipientText = `A encomenda com ID #${order_id} que você está aguardando teve seu status alterado para "${status}".`;
    const recipientHtml = `<p>A encomenda com ID #${order_id} que você está aguardando teve seu status alterado para "<strong>${status}</strong>".</p>`;

    const recipientMailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient.email,
      subject,
      text: recipientText,
      html: recipientHtml,
    };

    try {
      await transporter.sendMail(recipientMailOptions);
      console.log(`Notificação enviada ao destinatário: ${recipient.email}`);
    } catch (error) {
      console.error(`Erro ao enviar e-mail para o destinatário ${recipient.email}:`, error);
    }
  }
};

module.exports = {sendResetPasswordEmail, sendOrderStatusNotification};