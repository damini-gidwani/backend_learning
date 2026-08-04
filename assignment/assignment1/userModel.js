const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    trim: true,
    required: true,
    match: /^[a-zA-Z]+$/,
  },
  lname: {
    type: String,
    trim: true,
    required: true,
    match: /^[a-zA-Z]+$/,
  },
  dob: {
    type: Date,
    trim: true,
    required: true,
  },
  gen: {
    type: String,
    enum: ["male", "female", "others"],
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 8,
  },
});

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

const userModel = mongoose.model("user", userSchema);
const productModel = mongoose.model("product", productSchema);
module.exports = { userModel, productModel };
