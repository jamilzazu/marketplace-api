const express = require('express')
const routes = express.Router()

// Controllers
const UserController = require('./app/controllers/UserController')
const SessionController = require('./app/controllers/SessionController')

// User routes
routes.post('/users', UserController.store)

// Auth
routes.post('/sessions', SessionController.store)

module.exports = routes
