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
    const allReviews = await reviewModel.find({})
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))

    if(allReviews.length===0){
        throw new Error("no review found");
    }
    return allReviews;
};

module.exports = { createReview , getReviews };
