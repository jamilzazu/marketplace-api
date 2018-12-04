const express = require('express')
const routes = express.Router()

// Controllers
const UserController = require('./app/controllers/User')

// User routes
routes.post('/users', UserController.store)

module.exports = routes
