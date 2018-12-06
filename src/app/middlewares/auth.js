const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')

// Transforma funções de callback em promisse para uso do async await
const { promisify } = require('util')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  const [, token] = authHeader.split(' ')

  try {
    /**
     * @description: A função promisify transforma funções sicronas em assicronas. É nativo do nodejs.
     * A chamada verifica se o token enviado no header é válido, e caso seja é adicionado no req
     * o user id para envio em futuras requisições
     */
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)

    req.userId = decoded.id

    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' })
  }
}
