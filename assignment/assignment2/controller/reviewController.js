const {
  createReview,
  getReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../service/reviewSvc");

const createRev = async (req, res) => {
  try {
    const data = req.body;
    const review = await createReview(data);
    res.status(201).json({ message: "review created successfully!!", review });
  } catch (err) {
    next(err)
  }
};

const getRev = async (req, res) => {
  try {
    const { page = 1, limit = 2 } = req.query;
    const reviews = await getReviews(page, limit);
    res.json({ message: "reviews fetched suucessfully!!", reviews });
  } catch (err) {
    next(err)
  }
};

const getSingleRev = async (req, res) => {
  try {
    const review = await getSingleReview(req.params.id);

    res.status(200).json({
      message: "Review fetched successfully",
      review,
    });
  } catch (err) {
    next(err)
  }
};

const updateRev = async (req, res) => {
  try {
    const review = await updateReview(req.params.id, req.body);

    res.status(200).json({
      message: "Review updated successfully",
      review,
    });
  } catch (err) {
    next(err)
  }
};

const deleteRev = async (req, res) => {
  try {
    const review = await deleteReview(req.params.id);

    res.status(200).json({
      message: "Review deleted successfully",
      review,
    });
  } catch (err) {
    next(err)
  }
};

module.exports = { createRev, getRev, getSingleRev, updateRev, deleteRev };
