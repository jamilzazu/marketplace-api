const express = require('express')
const mongoose = require('mongoose')
const databaseConfig = require('./config/database')

// Valida erros na API
const validatior = require('express-validation')
const Youch = require('youch')
const Sentry = require('@sentry/node')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.sentry()
    this.database()
    this.middlewares()
    this.routes()
    this.exception()
  }

  // Configurado antes de tudo para que toda a API seja monitorada pelo Sentry
  sentry () {
    Sentry.init({ dsn: 'https://a849399c2e534922b14f568b3dee5ae0@sentry.io/1340291' })
  }

  database () {
    mongoose.connect(
      databaseConfig.uri,
      {
        useCreateIndex: true,
        useNewUrlParser: true
      }
    )
  }

  middlewares () {
    this.express.use(express.json())
    this.express.use(Sentry.Handlers.requestHandler())
  }

  routes () {
    this.express.use(require('./routes'))
  }

  exception () {
    // Valida erros em produção
    if (process.env.NODE_ENV === 'production') {
      this.express.use(Sentry.Handlers.errorHandler())
    }

    this.express.use(async (err, req, res, next) => {
      // Valida se o erro lançado é uma instância do express-validation
      if (err instanceof validatior.ValidationError) {
        return res.status(err.status).json(err)
      }

      // Verifica se estamos em ambiente de desenvolvimento
      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err, req)

        return res.json(await youch.toJSON())
      }

      return res.status(err.status || 500).json({ error: 'Internal Server Error' })
    })
  }
}

module.exports = new App().express
