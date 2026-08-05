const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const loginUser = async (email, password) => {
  const userExist = await userModel.findOne({ email });

  if (!userExist) {
    throw new Error("Invalid credentials!!");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    userExist.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials!!");
  }

  const token = jwt.sign(
    { userID: userExist._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return {
    user: userExist,
    token,
  };
};

const registerUser = async (
  fname,
  lname,
  dob,
  gen,
  email,
  createPass,
  confirmPass
) => {
  const user = await userModel.findOne({ email });

  if (user) {
    throw new Error("User already exists");
  }

  if (createPass !== confirmPass) {
    throw new Error("Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(
    createPass,
    Number(process.env.SALT)
  );

  const newUser = {
    fname,
    lname,
    dob,
    gen,
    email,
    password: hashedPassword,
  };

  const createdUser = await userModel.create(newUser);

  return createdUser;
};

module.exports = {
  loginUser,
  registerUser,
};