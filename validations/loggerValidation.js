const Joi = require('joi');

const validateLogger = (data) => {

  const createLogerSchema =   Joi.object({
        email: Joi.string().email(),
        user_id: Joi.string()
    })

    return createLogerSchema.validate(data);
}

module.exports = validateLogger