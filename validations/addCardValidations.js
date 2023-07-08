const Joi = require('joi');

const validateAddCard = (data) => {

  const createAddCardSchema =   Joi.object({
        email: Joi.string().email().required(),
        amount: Joi.number().required()
   
    })

    return createAddCardSchema.validate(data);
}


module.exports = {
    validateAddCard
};