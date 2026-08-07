const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
const { decodeBase64 } = require("bcryptjs");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.givenToken;

    if (!token) {
      return res
        .status(401)
        .send("Unauthorized! Please login to access this resource.");
    }

    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // const user = await userModel.findById(decode.userID);

    if (!decode) {
      return res.status(401).send("User not found");
    }

    req.user = decode;

    next();

  } catch (err) {
    console.log(err);

    return res
      .status(401)
      .send("Invalid or Expired Token");
  }
};

module.exports = authMiddleware;