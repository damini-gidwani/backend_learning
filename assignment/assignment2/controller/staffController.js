const {
  registerStaff,
  loginStaff,
  getStaffById,
} = require("../service/staffService");

const register = async (req, res) => {
  const staff = await registerStaff(req.body);

  const staffData = staff.toObject();
  delete staffData.password;

  res.status(201).json({
    success: true,
    message: "Staff registered successfully",
    data: staffData,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const { staff, token } = await loginStaff(email, password);

  res.cookie("token", token, {
    httpOnly: true,
  });

  const staffData = staff.toObject();
  delete staffData.password;

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: staffData,
  });
};

const getMe = async (req, res) => {
  const staff = await getStaffById(req.user._id);

  res.status(200).json({
    success: true,
    message: "Staff details fetched successfully",
    data: staff,
  });
};

module.exports = {
  register,
  login,
  getMe,
};