const express = require("express");

const {
  createRev,
  getRev,
} = require("../controller/reviewController");

const router = express.Router();

router.post("/create", createRev);

router.get("/get", getRev);

module.exports = router;