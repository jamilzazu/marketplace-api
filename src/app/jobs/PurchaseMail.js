const Mail = require('../services/Mail')

// Job reponsável por enviar o email
class PurchaseMail {
  // Retorna a chave única do redis
  get keyof () {
    return 'PurchaseMail '
  }

  // Serviço responsável por enviar o email
  // job recebe todos os valores que serão passados para o job
  // done é chamado quando o processo é concluído
  async handle (job, done) {
    const { ad, user, content } = job.data

    Mail.sendMail({
      from: '"Maicon Silva" <maiconrs95@gmail.com>',
      to: ad.author.email,
      subject: `Solicitação de compra: ${ad.title}`,
      template: 'purchase',
      context: { user, content, ad }
    })

    return done()
  }
}

module.exports = new PurchaseMail()
