const Joi = require('joi');


const creatFaqValidations = (data) =>{
  const faqSchema = Joi.object({
    userId: Joi.string().required(),
    faq_title: Joi.string().required(),
    faq_body: Joi.string().required()
  });
  return {error} = faqSchema.validate(data);
};


const updateFaqValidations = (data) =>{
  const faqSchema = Joi.object({
    faq_id: Joi.string().required(),
    faq_title: Joi.string().required(),
    faq_body: Joi.string().required()
  });
  return {error} = faqSchema.validate(data);
};


module.exports = {
                    creatFaqValidations,
                    updateFaqValidations
};