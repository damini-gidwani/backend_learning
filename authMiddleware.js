const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res
        .status(401)
        .send("Unauthorized! Please login to access this resource.");
    }
    let secretkey = "MySecretKey";
    const decode = jwt.verify(token, secretkey);
    req.user = decode;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send("Invalid or Expired Token");
  }
};
module.exports = authMiddleware;
