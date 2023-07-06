const Joi = require('joi');

const validateCreateAccount = (data) => {

  const createAccountSchema =   Joi.object({
        surname: Joi.string().required(),
        othernames: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        dob: Joi.date().required(),
        phone: Joi.string().required(),
        repeat_password: Joi.ref('password'),
        gender: Joi.string().required()
   
    })

    return createAccountSchema.validate(data);
}


module.exports = {
    validateCreateAccount
};
