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

  console.log("Recipientes:", order.recipients);

  order.recipients.forEach(r => {
    console.log("Destinatário:", r?.recipient?.email);
  });
  

  if (!sender || !sender.email) {
    console.error("Email do remetente não encontrado.");
    return;
  }

  // Lista dos nomes completos dos destinatários
  const recipientNames = recipients
    .map(r => `${r?.recipient?.name || "N/A"} ${r?.recipient?.surname || ""}`)
    .filter(Boolean);

  // Trecho para o assunto (limita a 3 nomes)
  const subjectSnippet = recipientNames.slice(0, 3).join(", ") + (recipientNames.length > 3 ? "..." : "");

  // Lista completa de destinatários para o corpo
  const fullRecipientList = recipientNames.join(", ");


  // Assunto e corpo do e-mail do remetente
  const senderSubject = `Atualização da encomenda para ${subjectSnippet} - Status: ${status}`;
  const senderText = `Olá ${sender.name}, o status da sua encomenda com descrição "${order.description}" e tracking code: ${order.tracking_code}, foi alterado para "${status}".\nDestinatários: ${fullRecipientList}`;
  const senderHtml = `
    <p>Olá, o status da sua encomenda com descrição "<strong>${order.description}</strong>" foi alterado para "<strong>${status}</strong>".</p>
    <p><strong>Destinatários:</strong> ${fullRecipientList}</p>
  `;

  // const subject = `Status da encomenda que está aguardando de ${sender.name} ${sender.surname}, foi alterado para: ${status}`;//Status da sua encomenda #${order_id} alterado para: ${status}

  // const senderText = `Olá, o status da sua encomenda com descrição ${order.description} e tracking code: ${order.tracking_code}, foi alterado para "${status}".`;
  // const senderHtml = `<p>Olá, o status da sua encomenda com decrição ${order.description} foi alterado para "<strong>${status}</strong>".</p>`;

  // E-mail para o remetente
  const senderMailOptions = {
    from: process.env.EMAIL_USER,
    to: sender.email,
    subject: senderSubject,
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
    const email = recipient?.recipient?.email;

    if (!email) {
      console.warn(`Destinatário ${recipient?.recipient?.user_id || recipient.user_id} sem e-mail. Pulando...`);
      continue;
    }

    const recipientText = `A encomenda que você está aguardando de ${sender.name} ${sender.surname} com tracking code ${order.tracking_code} teve seu status alterado para "${status}".`;
    const recipientHtml = `
    <p>A encomenda que você está aguardando de <strong>${sender.name} ${sender.surname}</strong> com tracking code <strong>${order.tracking_code}</strong> teve seu status alterado para "<strong>${status}</strong>".</p>
  `;
    const recipientMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject:`Status da encomenda que você está aguardando de ${sender.name} ${sender.surname} foi alterado para: ${status}`,
      text: recipientText,
      html: recipientHtml,
    };

    try {
      await transporter.sendMail(recipientMailOptions);
      console.log(`Notificação enviada ao destinatário: ${email}`);
    } catch (error) {
      console.error(`Erro ao enviar e-mail para o destinatário ${email}:`, error);
    }
  }
};

module.exports = {sendResetPasswordEmail, sendOrderStatusNotification};