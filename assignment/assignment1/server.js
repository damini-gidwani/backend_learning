require("dotenv").config({
  path: __dirname + "/.env",
});

const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./db");
const path = require("path")

const app = express();

const authRouter = require("./routes/authRouter");
const productRouter = require("./routes/productRouter");
const addressRouter = require("./routes/addressRouter");

//global middlewares
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/address", addressRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB()
  .then(() => {
    app.listen(Number(process.env.PORT), () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to DB", err);
  });
