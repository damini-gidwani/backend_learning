const express = require("express");
const app = express();
const connectDB = require("./db");
const userModel = require("./userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const authMiddleware=require("./authMiddleware")
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.post("/register", async (req, res) => {
  try {
    const validateSchema = joi.object({ 
      fname: joi.string().min(2).max(128).required(),
      lname: joi.string().min(2).max(128).required(),
      dob: joi.date().required(),
      gen: joi.string().valid("male", "female", "others").required(),
      email: joi.string().email().required(),
      createPass: joi.string().min(8).required(),
      confirmPass: joi.string().min(8).required(),
    });

    const { error } = validateSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { fname, lname, dob, gen, email, createPass, confirmPass } = req.body;

    const user = await userModel.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    if (createPass !== confirmPass)
      return res.status(400).json({ message: "Passwords do not match" });

    const hashedPassword = await bcrypt.hash(createPass, 10);

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
});

app.post("/login", async (req, res) => {
  try {
    console.log(req.cookies);
    const validationSchema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
    });
    const { error } = validationSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

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
    const token = jwt.sign({ userID: userExist._id }, "MySecretKey", {
      expiresIn: "1h",
    });

    res.cookie("givenToken", token, { httpOnly: true });

    res
      .status(200)
      .send(`Welcome ${userExist.fname}!! You are logged in successfully!`);
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
});

app.get("/logout", authMiddleware, async (req, res) => {
  try {
    res.clearCookie("givenToken", { httpOnly: true });
    res.send("Logged out successfully!!");
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
});

connectDB()
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.log("Error connecting to DB", err);
  });
