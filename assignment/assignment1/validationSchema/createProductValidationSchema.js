const joi = require("joi");

const validateSchema = joi.object({
  name: joi.string().required().min(2),
  price: joi.number().required().min(0),
  category: joi
    .string()
    .required()
    .valid("electronics", "clothing", "books", "home", "sports"),
  SKU: joi.string().required(),
});

module.exports = validateSchema;
