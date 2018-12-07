const Ad = require('../models/Ad')
const User = require('../models/User')
const Mail = require('../services/Mail')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    // Verifica se o item existe no banco de dados
    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    Mail.sendMail({
      from: '"Maicon Silva" <maiconrs95@gmail.com>',
      to: purchaseAd.author.email,
      subject: `Solicitação de compra: ${purchaseAd.title}`,
      template: 'purchase',
      context: { user, content, ad: purchaseAd }
    })

    return res.send()
  }
}

module.exports = new PurchaseController()
