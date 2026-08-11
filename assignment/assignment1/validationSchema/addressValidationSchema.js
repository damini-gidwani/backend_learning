const Joi = require("joi");

const validateSchema = Joi.object({
  type: Joi.string().valid("home", "office", "hostel", "other").required(),

  address: Joi.string().trim().required(),

  city: Joi.string().trim().required(),

  state: Joi.string().trim().required(),

  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required(),

  longitude: Joi.number().required(),

  latitude: Joi.number().required(),
});

module.exports = validateSchema;
