const Joi = require('joi')

/**
 * @description: O Joi permite tanto a validação do body, params e query params
 */
module.exports = {
  body: {
    name: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
      .min(6)
  }
}
