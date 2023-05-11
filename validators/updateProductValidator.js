const Joi = require("joi");

const updateProductSchema = Joi.object({
  name: Joi.string(),
  price: Joi.number(),
  quantity: Joi.number(),
  status: Joi.string(),
});

module.exports = updateProductSchema;
