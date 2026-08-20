const jwt = require("jsonwebtoken");
const StaffModel = require("../model/staffModel");
const { unauthorized } = require("../utils/apiError");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw unauthorized("Authentication required");
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const staff = await StaffModel.findById(decoded.id).select("-password");

    if (!staff) {
      throw unauthorized("Staff not found");
    }

    req.user = staff;

    next();
  } catch (err) {
    if (err.statusCode) {
      throw err;
    }

    throw unauthorized("Invalid or expired token");
  }
};

module.exports = authMiddleware;