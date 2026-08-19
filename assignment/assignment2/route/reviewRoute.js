const express = require("express");

const {
  createRev,
  getRev,
  getSingleRev,
  updateRev,
  deleteRev
} = require("../controller/reviewController");

const router = express.Router();

router.post("/create", createRev);

router.get("/get", getRev);

router.get("/getSingleReview/:id", getSingleRev);

router.put("/updateReview/:id", updateRev);

router.delete("/deleteReview/:id", deleteRev);

module.exports = router;