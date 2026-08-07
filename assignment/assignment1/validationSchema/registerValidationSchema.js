const joi = require("joi");

const validateSchema = joi.object({
  fname: joi.string().min(2).max(128).required(),
  lname: joi.string().min(2).max(128).required(),
  dob: joi.date().required(),
  gen: joi.string().valid("male", "female", "others").required(),
  role:joi.string().required().valid("admin","user","seller"),
  email: joi.string().email().required(),
  createPass: joi.string().min(8).required(),
  confirmPass: joi.string().min(8).required(),
});

module.exports = validateSchema;
