const express = require("express");
const app = express();
const connectDB = require("./db");
const { userModel, productModel } = require("./userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const authMiddleware = require("./authMiddleware");
const cookieParser = require("cookie-parser");
const { RiReservedFill } = require("react-icons/ri");

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
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/logout", authMiddleware, async (req, res) => {
  try {
    res.clearCookie("givenToken", { httpOnly: true });
    res.send("Logged out successfully!!");
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.post("/createProduct", authMiddleware, async (req, res) => {
  try {
    const validateSchema = joi.object({
      name: joi.string().required().min(2),
      price: joi.number().required().min(0),
      category: joi
        .string()
        .required()
        .valid("electronics", "clothing", "books", "home", "sports"),
      SKU: joi.string().required(),
    });
    const { error } = validateSchema.validate(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    const { name, price, category, SKU } = req.body;
    const product = {
      name,
      price,
      category,
      SKU,
    };
    let productExist = await productModel.findOne({ SKU });
    if (productExist) {
      return res.status(400).send({ message: "Product already exist!" });
    }
    const newproduct = await productModel.create(product);
    res.status(201).json({
      message: "Product created successfully",
      product: newproduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ meassage: "Internal Server Error" });
  }
});

app.delete("/deleteProductBySku/:sku", authMiddleware, async (req, res) => {
  const sku = req.params.sku;
  if (!sku) {
    return res.status(400).json({ message: "give sku to delete product!" });
  }
  const isExist = await productModel.findOne({ SKU: sku });
  if (!isExist) {
    return res.status(400).send({ message: "Product does not exist!" });
  }
  await productModel.deleteOne({ SKU: sku });
  res.status(200).json({ message: "product deleted successfully!!" });
});

app.get("/getAllProducts", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 2, sort = "asc" } = req.query;
    const allProducts = await productModel
      .find({})
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ price: sort === "asc" ? 1 : -1 })
      .select("-_id -SKU -__v");
    res.json({ meassage: "All products : ", allProducts });
  } catch (err) {
    console.log(err);
    res.status(500).send({ meassage: "Internal Server Error" });
  }
});

app.put("/updateProductById/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "give id to delete product!" });
    }
    const updateProduct = await productModel.findOneAndUpdate(
      { _id: id },
      {
        $set: req.body,
      },
      { returnDocument: "after" },
    );
    if (!updateProduct) {
      return res.status(404).json({ message: "product not found!" });
    }
    res.json({ message: "product update", updateProduct });
  } catch (err) {
    console.log(err);
    res.status(500).send({ meassage: "Internal Server Error" });
  }
});

app.get("/getProductById/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "give id to delete product!" });
    }
    const product = await productModel
      .findOne({ _id: id })
      .select("-SKU -_id -__v");
    if (!product) {
      return res.status(400).send({ message: "Product does not exist!" });
    }
    res.json({ product });
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
