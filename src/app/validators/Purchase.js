const Joi = require('joi')

/**
 * @description: O Joi permite tanto a validação do body, params e query params
 */
module.exports = {
  body: {
    ad: Joi.string().required(),
    content: Joi.string().required()
  }
}
