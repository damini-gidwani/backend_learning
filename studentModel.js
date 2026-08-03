const mongoose = require("mongoose");
const registerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 128,
      required: true,
      trim: true,
      match: /^[a-zA-Z ]+$/,
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 128,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    },
  },
  { timestamps: true },
);
const addressSchema = new mongoose.Schema(
  {
    house_no: {
      type: String,
      trim: true,
    },
    colony: {
      type: String,
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 128,
      required: true,
      trim: true,
      match: /^[a-zA-Z ]+$/,
    },
    skills: [String],
    course: { type: String, trim: true },
    stream: {
      type: String,
      uppercase: true,
      enum: ["CSE", "AI", "ECE", "CIVIL", "MECHANICAL"],
      trim: true,
    },
    roll_no: {
      type: Number,
      max: 500,
      min: 1,
      trim: true,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    },
    address: { type: addressSchema, default: {} },
    gender: {
      type: String,
      default: "",
      validate: {
        // validator: (v) => {
        //   return ["male", "female", "others"].includes(v);
        // },message:"Invalid gender!"
        validator: (v) => {
          if (!["male", "female", "others"].includes(v))
            throw new Error("Invalid gender!");
          return true;
        },
      },
    },
  },
  { timestamps: true, strict: true },
);
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 128,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 512,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ["electronics", "clothing", "books", "home", "sports"],
      lowercase: true,
    },
    SKU:{
      type: String,
      required: true,
      unique: true,
      trim: true,
    }
  },
  { timestamps: true },
);

const studentModel = mongoose.model("student", studentSchema);
const registerModel = mongoose.model("register", registerSchema);
const productModel = mongoose.model("product", productSchema);
module.exports = { studentModel, registerModel, productModel };
