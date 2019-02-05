const express = require('express')
const routes = express.Router()
// Passa os erros lançados pelas controller para o express
const handler = require('express-async-handler')

// All Controllers
const controllers = require('./app/controllers')

// Middlewares
const authMiddleware = require('./app/middlewares/auth')
const validate = require('express-validation')
const validators = require('./app/validators')

routes.post('/test', (req, res) => {
  return res.status(200).send({ message: 'api online' })
})
/**
 * User
 */
routes.post(
  '/users',
  validate(validators.User),
  handler(controllers.UserController.store)
)

/**
 * Auth
 */
routes.post(
  '/sessions',
  validate(validators.Session),
  handler(controllers.SessionController.store)
)

routes.use(authMiddleware) // Todas as rotas posterior ao authmiddlewares necessitam de autenticação

/**
 * Ads
 */
routes.get('/ads', handler(controllers.AdController.index))
routes.get('/ads/:id', handler(controllers.AdController.show))
routes.post(
  '/ads',
  validate(validators.Ad),
  handler(controllers.AdController.store)
)
routes.put(
  '/ads/:id',
  validate(validators.Ad),
  handler(controllers.AdController.udpate)
)
routes.delete('/ads/:id', handler(controllers.AdController.destroy))

/**
 * Purchase
 */
routes.post(
  '/purchase',
  validate(validators.Purchase),
  handler(controllers.PurchaseController.store)
)

module.exports = routes
