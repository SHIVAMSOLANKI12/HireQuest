const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });

  return transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@hirequest.com',
    to,
    subject,
    text,
    html,
  });
};

module.exports = { sendEmail };
