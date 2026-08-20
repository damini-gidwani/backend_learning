require("dotenv").config({
  path: __dirname + "/.env",
});

const express = require("express");
const connectDB = require("./config/db");
const route=require("./route/reviewRoute")
const staffRoute = require("./route/staffRoute")
const {notFound,errorHandler}=require("./middleware/errorHandler")
const cookieParser=require("cookie-parser")

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/review",route)
app.use("/staff", staffRoute);

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(Number(process.env.PORT), () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to DB", err);
  });
