const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [80, "Title must not exceed 80 characters"],
      trim: true,
    },

    comment: {
      type: String,
      required: [true, "Comment is required"],
      minlength: [10, "Comment must be at least 10 characters long"],
      maxlength: [500, "Comment must not exceed 500 characters"],
      trim: true,
    },

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must not exceed 5"],
      validate: {
        validator: Number.isInteger,
        message: "Rating must be a whole number",
      },
    },

    reviewerName: {
      type: String,
      required: [true, "Reviewer name is required"],
      minlength: [2, "Reviewer name must be at least 2 characters long"],
      maxlength: [50, "Reviewer name must not exceed 50 characters"],
      trim: true,
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },

    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ReviewModel = mongoose.model("review", reviewSchema);

module.exports = ReviewModel;