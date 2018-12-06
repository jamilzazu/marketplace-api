const express = require('express')
const routes = express.Router()

// Controllers
const UserController = require('./app/controllers/UserController')
const SessionController = require('./app/controllers/SessionController')

// Middlewares
const authMiddleware = require('./app/middlewares/auth')

// User routes
routes.post('/users', UserController.store)

// Auth
routes.post('/sessions', SessionController.store)
routes.get('/teste', authMiddleware, (req, res) => {
  return res.json({ ok: true })
})

module.exports = routes
