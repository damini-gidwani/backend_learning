const { GrUserSettings } = require("react-icons/gr");
const {
  loginUser,
  registerUser,
  getAllUser,
  getOneUser,
} = require("../service/userService");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser(email, password);

    res.cookie("givenToken", token, {
      httpOnly: true,
    });

    res
      .status(200)
      .send(`Welcome ${user.fname}!! You are logged in successfully!`);
  } catch (err) {
    console.log(err);

    if (err.message === "Invalid credentials!!") {
      return res.status(400).send(err.message);
    }

    res.status(500).send({
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("givenToken", {
      httpOnly: true,
    });

    res.send("Logged out successfully!!");
  } catch (err) {
    console.log(err);

    res.status(500).send({
      message: "Internal server error",
    });
  }
};

const register = async (req, res) => {
  try {
    const { fname, lname, dob, gen, role, email, createPass, confirmPass } =
      req.body;

    const createdUser = await registerUser(
      fname,
      lname,
      dob,
      gen,
      role,
      email,
      createPass,
      confirmPass,
    );

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: createdUser._id,
        fname: createdUser.fname,
        lname: createdUser.lname,
        dob: createdUser.dob,
        gen: createdUser.gen,
        role: createdUser.role,
        email: createdUser.email,
      },
    });
  } catch (err) {
    console.log(err);

    if (
      err.message === "User already exists" ||
      err.message === "Passwords do not match"
    ) {
      return res.status(400).json({
        message: err.message,
      });
    }

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUser();
    res.json({ message: "users fetched suucessfully!", users });
  } catch (err) {
    console.log(err);
    if (err.message == "users not found")
      return res.json({ message: "users not found" });
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await getOneUser(req.params.id);

    return res.json({
      message: "user fetched successfully!",
      user
    });
  } catch (err) {
    console.log(err);

    if (err.message === "user not found") {
      return res.status(404).json({
        message: "user not found"
      });
    }

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const user = await getOneUser(req.user.userID);

    return res.json({
      message: "user fetched successfully!",
      user
    });
  } catch (err) {
    if (err.message === "user not found") {
      return res.status(404).json({
        message: "user not found"
      });
    }

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = {
  login,
  logout,
  register,
  getAllUsers,
  getUserById,
  getMyProfile
};
