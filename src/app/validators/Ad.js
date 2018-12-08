const Joi = require('joi')

/**
 * @description: O Joi permite tanto a validação do body, params e query params
 */
module.exports = {
  body: {
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required()
  }
}
