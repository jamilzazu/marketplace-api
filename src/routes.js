const express = require('express')
const routes = express.Router()

// All Controllers
const controllers = require('./app/controllers')

// Middlewares
const authMiddleware = require('./app/middlewares/auth')
const validate = require('express-validation')
const validators = require('./app/validators')

/**
 * User
 */
routes.post('/users', validate(validators.User), controllers.UserController.store)

/**
 * Auth
 */
routes.post('/sessions', validate(validators.Session), controllers.SessionController.store)

routes.use(authMiddleware) // Todas as rotas posterior ao authmiddlewares necessitam de autenticação

/**
 * Ads
 */
routes.get('/ads', controllers.AdController.index)
routes.get('/ads/:id', controllers.AdController.show)
routes.post('/ads', validate(validators.Ad), controllers.AdController.store)
routes.put('/ads/:id', validate(validators.Ad), controllers.AdController.udpate)
routes.delete('/ads/:id', controllers.AdController.destroy)

/**
 * Purchase
 */
routes.post('/purchase', validate(validators.Purchase), controllers.PurchaseController.store)

module.exports = routes
