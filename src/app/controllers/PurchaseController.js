const Ad = require('../models/Ad')
const User = require('../models/User')
const Mail = require('../services/Mail')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    // Verifica se o item existe no banco de dados
    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)
    console.log(purchaseAd)
    Mail.sendMail({
      from: '"Maicon Silva" <maiconrs95@gmail.com>',
      to: purchaseAd.author.email,
      subject: `Solicitação de compra: ${purchaseAd.title}`,
      html: `<p>Test ${content}</p>`
    })

    return res.send()
  }
}

module.exports = new PurchaseController()
