const Joi = require('joi');

const complainValidation = (data)=>{
  const complainSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    message: Joi.string().required()
  });
  return {error} = complainSchema.validate(data);
};

module.exports = complainValidation;
