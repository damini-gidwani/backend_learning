const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
    required: true,
  },
  gen: {
    type: String,
    enum: ["male", "female", "others"],
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["admin", "user", "seller"],
    required: true,
    trim: true,
    default: "user",
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

userSchema.virtual("addresses",{
  ref:"address",
  localField:"_id",
  foreignField:"user"
})

userSchema.set("toJSON",{virtuals:true});
userSchema.set("toObject",{virtuals:true})

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, Number(process.env.SALT));
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
