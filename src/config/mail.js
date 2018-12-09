/**
 * @description: Configurações do noemailer
 * - Foi sendo utilizado o mailtrap para envio de e-mail
 */
module.exports = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
}
