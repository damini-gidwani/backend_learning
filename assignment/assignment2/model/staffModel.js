const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must not exceed 50 characters"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    department: {
      type: String,
      enum: ["sales", "support"],
      required: [true, "Department is required"],
    },
  },
  {
    timestamps: true,
  }
);

staffSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

const StaffModel = mongoose.model("staff", staffSchema);

module.exports = StaffModel;