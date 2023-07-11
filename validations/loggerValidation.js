const Joi = require("joi");

const validateLogger = (data) => {
  const createLogerSchema = Joi.object({
    email: Joi.string().email().required()
});

  return createLogerSchema.validate(data);
};

module.exports = validateLogger;
