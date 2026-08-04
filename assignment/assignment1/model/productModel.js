const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    match: /^[a-zA-Z ]+$/,
  },
  price: {
    type: Number,
    trim: true,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ["electronics", "clothing", "books", "home", "sports"],
    lowercase: true,
  },
  SKU: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});
const productModel = mongoose.model("product", productSchema);
module.exports = productModel;
