const express = require('express')
const routes = express.Router()

// Controllers
const controllers = require('./app/controllers')

// Middlewares
const authMiddleware = require('./app/middlewares/auth')

// User routes
routes.post('/users', controllers.UserController.store)

// Auth
routes.post('/sessions', controllers.SessionController.store)
routes.get('/teste', authMiddleware, (req, res) => {
  return res.json({ ok: true })
})

module.exports = routes
