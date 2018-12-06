const User = require('../models/User')

class SessionController {
  // Valida email, senha e retorna o token caso o user se autentique com os dados corretos
  async store (req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ error: 'e-mail não encontrado' })
    }

    if (!(await user.compareHash(password))) {
      return res.status(400).json({ error: 'senha inválida' })
    }

    return res.json({ user, token: User.generateToken(user) })
  }
}

module.exports = new SessionController()
