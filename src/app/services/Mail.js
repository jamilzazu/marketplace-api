/**
 * @description: Configurações de transoporte do nodemailer
 * - Em ambiente de DEV foi utilizado o nodemail, pois todos os e-mail enviados devem ser direcionados a uma única caixa de entrada independente do destinatário
 * - Em prod deve ser configurado um servidor de e-mail externo como o g-mail, mandril, Amazon Sas, ParkPost dentre outros
 */
const nodemailer = require('nodemailer')
const mailConfig = require('../../config/mail')

const transport = nodemailer.createTransport(mailConfig)

module.exports = transport
