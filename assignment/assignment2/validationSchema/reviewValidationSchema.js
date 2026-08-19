const Joi = require("joi");

const createReviewSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(80)
    .required(),

  comment: Joi.string()
    .trim()
    .min(10)
    .max(500)
    .required(),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required(),

  reviewerName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  status: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending"),

  isVerifiedPurchase: Joi.boolean()
    .default(false),
});

module.exports = createReviewSchema;