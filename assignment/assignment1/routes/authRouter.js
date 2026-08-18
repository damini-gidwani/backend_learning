const validationMiddleware = require("../middlewares/validationMiddleware");
const registerSchema = require("../validationSchema/registerValidationSchema");
const loginSchema = require("../validationSchema/loginValidationSchema");
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware")
const {
  login,
  logout,
  register,
  getAllUsers,
  getUserById,
  getMyProfile,
  refreshToken,
  dltProfile,
  updProfile
} = require("../controller/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/autorizationMiddleware");

router.post("/register",upload.single("profilePicture"), validationMiddleware(registerSchema), register);

router.post("/login", validationMiddleware(loginSchema), login);

router.get("/logout", authMiddleware, logout);

router.get("/getAllUser", authMiddleware, authorization("admin"), getAllUsers);

router.get("/getUserById/:id", authMiddleware, authorization("admin"), getUserById);

router.get("/getMyInfo", authMiddleware, getMyProfile);

router.post("/refreshToken",refreshToken);

router.delete("/dltProfilePicture",authMiddleware,dltProfile)

router.post("/updProfilePicture",upload.single("image"),authMiddleware,updProfile)

module.exports = router;
