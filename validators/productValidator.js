const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  status: Joi.string().required(),
});

module.exports = productSchema;
