const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res
        .status(401)
        .send("Unauthorized! Please login to access this resource.");
    }

    const decode = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // const user = await userModel.findById(decode.userID);

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