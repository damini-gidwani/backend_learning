const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      requires: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const imageModel = mongoose.model("image", imageSchema);
module.exports = imageModel;