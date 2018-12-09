const Ad = require('../models/Ad')
const User = require('../models/User')

// Serviço de envio de e-mail através do redis
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  // Salva uma nova intenção de compra e envia e-mail para o anunciante
  async store (req, res) {
    const { ad, content } = req.body

    // Verifica se o item existe no banco de dados
    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    // Executa e salva o job no redis
    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    return res.send()
  }
}

module.exports = new PurchaseController()
