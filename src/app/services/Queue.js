const kue = require('kue')
const redisConfig = require('../../config/redis')
const jobs = require('../jobs')
const Sentry = require('@sentry/node')

const Queue = kue.createQueue({ redis: redisConfig })

/**
 * @description:  Inicia o processo redis passando a key é o método chamado
 * Todos os processos que tiverem a mesma key serão iniciados na chamada
 */
Queue.process(jobs.PurchaseMail.key, jobs.PurchaseMail.handle)

Queue.on('error', Sentry.captureException)

module.exports = Queue
