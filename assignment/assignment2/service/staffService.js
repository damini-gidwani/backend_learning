const StaffModel = require("../model/staffModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { conflict, unauthorized } = require("../utils/apiError");

const registerStaff = async (data) => {
  const exists = await StaffModel.findOne({
    email: data.email,
  });

  if (exists) {
    throw conflict("Email already exists");
  }

  const staff = await StaffModel.create(data);

  return staff;
};

const loginStaff = async (email, password) => {
  const staff = await StaffModel.findOne({ email });

  if (!staff) {
    throw unauthorized("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, staff.password);

  if (!isMatch) {
    throw unauthorized("Invalid email or password");
  }

  const token = jwt.sign(
  {
    id: staff._id,
    department: staff.department,
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: "1h",
  }
);

  return {
    staff,
    token,
  };
};

const getStaffById = async (id) => {
  const staff = await StaffModel.findById(id).select("-password");

  if (!staff) {
    throw unauthorized("Staff not found");
  }

  return staff;
};

module.exports = {
  registerStaff,
  loginStaff,
  getStaffById,
};