const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      return res.status(400).send("oops! Invalid credentials!!");
    }
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) {
      return res.status(400).send("OOPS! Invalid credentials!!");
    }
    //generate a token and send it to the user
    const token = jwt.sign({ userID: userExist._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("givenToken", token, { httpOnly: true });

    res
      .status(200)
      .send(`Welcome ${userExist.fname}!! You are logged in successfully!`);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("givenToken", { httpOnly: true });
    res.send("Logged out successfully!!");
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error" });
  }
};

const register = async (req, res) => {
  try {
    const { fname, lname, dob, gen, email, createPass, confirmPass } = req.body;

    const user = await userModel.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    if (createPass !== confirmPass)
      return res.status(400).json({ message: "Passwords do not match" });

    const hashedPassword = await bcrypt.hash(
      createPass,
      Number(process.env.SALT),
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
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: createdUser._id,
        fname: createdUser.fname,
        lname: createdUser.lname,
        dob: createdUser.dob,
        gen: createdUser.gen,
        email: createdUser.email,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { login, logout, register };
