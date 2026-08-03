const express = require("express");
const connectDB = require("./db.js");
const bcrypt = require("bcrypt");
const joi = require("joi");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./authMiddleware.js");
const {
  studentModel,
  registerModel,
  productModel,
} = require("./studentModel.js");

app.use(express.json());
app.use(cookieParser());

// ===== CRUD Operations =====

//POST
app.post("/createStudent", async (req, res) => {
  try {
    const { name, course, stream, roll_no, email, skills, address, gender } =
      req.body;
    let studentData = {
      name: name,
      course: course,
      stream: stream,
      roll_no: roll_no,
      email: email,
      skills: skills,
      address: address,
      gender: gender,
    };

    await studentModel.create(studentData);
    res.status(201).send("student created successfully!!!");
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
});

//GET
app.get("/getAllStudents", async (req, res) => {
  try {
    const page = Number(req.query.page) || 2;
    const limit = Number(req.query.limit) || 3;
    let allStudents = await studentModel.find({});
    //   .limit(limit)
    //   .skip((page - 1) * limit)
    //   .select("-_id -email");
    res.json(allStudents);
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
});

//GET BY ID
app.get("/getStudentById/:id", async (req, res) => {
  try {
    let singleStudent = await studentModel.findById(req.params.id);

    if (!singleStudent) res.status(404).send("invalid Id!");
    else res.json(singleStudent);
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
});

//UPDATE
app.put("/updateStudent/:id", async (req, res) => {
  try {
    let updateStudent = await studentModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: { name: req.body },
      },
      { returnDocument: "after", runValidators: true },
    );
    res.send({ message: "student updates successfully!", updateStudent });
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
});

//DELETE
app.delete("/deleteStudentById/:id", async (req, res) => {
  try {
    await studentModel.findByIdAndDelete(req.params.id);
    res.send("student deleted successfully!!");
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
});

app.post("/register", async (req, res) => {
  try {
    const validationSchema = joi.object({
      name: joi.string().min(2).max(128).required(),
      email: joi.string().email().required(),
      password: joi.string().min(8).max(20).required(),
    });
    const { error } = validationSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { name, email, password } = req.body;
    const userExists = await registerModel.findOne({ email });
    if (userExists) {
      res.status(409).send("oops! User with this email already exists!!");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      let newUser = {
        name: name,
        email: email,
        password: hashedPassword,
      };
      await registerModel.create(newUser);
      res.status(201).send(`${name} registered successfully!!!`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log(req.cookies);
    const validationSchema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(8).max(20).required(),
    });
    const { error } = validationSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { email, password } = req.body;
    const userExist = await registerModel.findOne({ email });
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
      .send(`Welcome ${userExist.name}!! You are logged in successfully!`);
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
});

app.post("/createProduct", async (req, res) => {
  try {
    const validateSchema = joi.object({
      name: joi.string().min(2).max(128).required(),
      price: joi.number().min(0).required(),
      description: joi.string().max(512),
      category: joi
        .string()
        .valid("Electronics", "Clothing", "Books", "Home", "Sports")
        .required(),
      SKU: joi.string().required(),
    });

    const { name, price, description, category, SKU } = req.body;
    const product = {
      name: name,
      price: price,
      description: description,
      category: category,
      SKU: SKU,
    };
    const productExists = await ProductModel.findOne({ SKU: SKU });
    if (productExists) {
      return res.status(409).send("Product already exists!!");
    }
    await ProductModel.create(product);
    res.status(201).send("Product created successfully!!");
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
});

app.get("/getAllProducts", authMiddleware, async (req, res) => {
  try {
    const { page = 1, sort = "asc", limit = 3 } = req.query;
    const products = await productModel.find({})
      .sort({ price: sort === "asc" ? 1 : -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select("-_id -SKU -__v");
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
});

app.get("/getProductById/:id", authMiddleware, async (req, res) => {
  try{
    const product=await productModel.findById(req.params.id).select("-_id -SKU -__v");
    if(!product) return res.status(404).send("Product not found!");
    res.json(product);
  }
  catch(err){
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
})

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("server started!");
    });
  })
  .catch((err) => {
    console.log("db connection error", err);
  });
