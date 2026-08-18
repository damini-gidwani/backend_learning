const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const RefreshToken = require("../model/refreshTokenModel");

const loginUser = async (email, password) => {
  const userExist = await userModel.findOne({ email });

  if (!userExist) {
    throw new Error("Invalid credentials!!");
  }

  const isPasswordValid = await bcrypt.compare(password, userExist.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials!!");
  }

  const accessToken = jwt.sign(
    { userID: userExist._id, role: userExist.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    { userID: userExist._id, role: userExist.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  await RefreshToken.create({
  user: userExist._id,
  token: refreshToken,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
});

  return {
    user: userExist,
    accessToken,
    refreshToken,
  };
};

const registerUser = async (
  fname,
  lname,
  dob,
  gen,
  role,
  email,
  createPass,
  confirmPass,
  profilePicture
) => {
  const user = await userModel.findOne({ email });

  if (user) {
    throw new Error("User already exists");
  }

  if (createPass !== confirmPass) {
    throw new Error("Passwords do not match");
  }

  const newUser = {
    fname,
    lname,
    dob,
    gen,
    role,
    email,
    password: createPass,
    profilePicture: profilePicture
  };

  const createdUser = await userModel.create(newUser);

  return createdUser;
};

const getAllUser = async () => {
  const users = await userModel.find({});

  if (users.length === 0) {
    throw new Error("users not found");
  }

  return users;
};

const getOneUser = async (id) => {
  const user = await userModel.findById(id).populate("addresses");

  if (!user) {
    throw new Error("user not found");
  }

  return user;
};

module.exports = {
  loginUser,
  registerUser,
  getAllUser,
  getOneUser,
};
