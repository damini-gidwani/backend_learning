const reviewModel = require("../model/reviewModel");

const createReview = async (data) => {
  let exists = await reviewModel.findOne({
    reviewerName: data.reviewerName,
    title: data.title,
  });
  if (exists) {
    throw new Error("Duplicate review");
  }
  const createdReview = await reviewModel.create(data);
  return createdReview;
};

const getReviews = async (page, limit) => {
  const allReviews = await reviewModel
    .find({})
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  if (allReviews.length === 0) {
    throw new Error("no review found");
  }
  return allReviews;
};

const getSingleReview = async (id) => {
  const review = await reviewModel.findById(id);

  if (!review) {
    throw new Error("Review not found");
  }

  return review;
};

const updateReview = async (id, data) => {
  const review = await reviewModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return review;
};

const deleteReview = async (id) => {
  const review = await reviewModel.findByIdAndDelete(id);

  if (!review) {
    throw new Error("Review not found");
  }

  return review;
};

module.exports = {
  createReview,
  getReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
