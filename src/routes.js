const express = require('express')
const routes = express.Router()

// Controllers
const controllers = require('./app/controllers')

// Middlewares
const authMiddleware = require('./app/middlewares/auth')

/**
 * User
 */
routes.post('/users', controllers.UserController.store)

/**
 * Auth
 */
routes.post('/sessions', controllers.SessionController.store)

routes.use(authMiddleware) // Todas as rotas posterior ao authmiddlewares necessitam de autenticação

/**
 * Ads
 */
routes.get('/ads', controllers.AdController.index)
routes.get('/ads/:id', controllers.AdController.show)
routes.post('/ads', controllers.AdController.store)
routes.put('/ads/:id', controllers.AdController.udpate)
routes.delete('/ads/:id', controllers.AdController.destroy)

/**
 * Purchase
 */
routes.post('/purchase', controllers.PurchaseController.store)

module.exports = routes
