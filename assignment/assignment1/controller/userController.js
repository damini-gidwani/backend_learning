const jwt = require("jsonwebtoken");
const {
  loginUser,
  registerUser,
  getAllUser,
  getOneUser,
} = require("../service/userService");
const RefreshToken = require("../model/refreshTokenModel");
const cloudinary = require("../config/cloudinary");
const userModel = require("../model/userModel");

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "Refresh token missing",
      });
    }

    // 2. DB mein check karo
    const storedToken = await RefreshToken.findOne({
      token: token,
    });

    if (storedToken.expiresAt < new Date()) {
      return res.status(401).json({
        message: "Refresh token expired",
      });
    }

    if (!storedToken) {
      return res.status(401).json({
        message: "Refresh token is invalid",
      });
    }

    // 3. JWT verify karo
    const decode = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // 4. New access token banao
    const newAccessToken = jwt.sign(
      {
        userID: decode.userID,
        role: decode.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      },
    );

    // 5. New access token cookie mein save karo
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
    });

    return res.status(200).json({
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await loginUser(
      email,
      password,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
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
    res.clearCookie("accessToken", {
      httpOnly: true,
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
    });
    await RefreshToken.deleteOne({
      token: req.cookies.refreshToken,
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

    let profilePicture = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "profilePictures",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(req.file.buffer);
      });
      profilePicture = {
        url: result.secure_url,
        publicID: result.public_id,
      };
    }

    const createdUser = await registerUser(
      fname,
      lname,
      dob,
      gen,
      role,
      email,
      createPass,
      confirmPass,
      profilePicture,
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
        profilePicture: createdUser.profilePicture?.url || null,
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
      user,
    });
  } catch (err) {
    console.log(err);

    if (err.message === "user not found") {
      return res.status(404).json({
        message: "user not found",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const user = await getOneUser(req.user.userID);

    return res.json({
      message: "user fetched successfully!",
      user,
    });
  } catch (err) {
    if (err.message === "user not found") {
      return res.status(404).json({
        message: "user not found",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const dltProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userID);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.profilePicture || !user.profilePicture.publicID) {
      return res.status(400).json({
        message: "Profile picture does not exist",
      });
    }

    const publicId = user.profilePicture.publicID;

    await cloudinary.uploader.destroy(publicId);

    user.profilePicture = null;
    await user.save();

    return res.json({
      message: `${user.fname}'s profile picture deleted successfully!`,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userID);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Profile picture is required",
      });
    }

    // Old picture ka publicID save kar lo
    const oldPublicId = user.profilePicture?.publicID;

    // New image upload
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "profilePictures",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      stream.end(req.file.buffer);
    });

    // DB mein new picture save
    user.profilePicture = {
      url: result.secure_url,
      publicID: result.public_id,
    };

    await user.save();

    // Agar old picture thi, tab delete karo
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    return res.json({
      message: "Profile picture updated successfully!",
      profilePicture: user.profilePicture,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  login,
  logout,
  register,
  getAllUsers,
  getUserById,
  getMyProfile,
  refreshToken,
  dltProfile,
  updProfile
};
