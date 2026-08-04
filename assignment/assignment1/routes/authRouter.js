const validationMiddleware = require("../middlewares/validationMiddleware");
const registerSchema = require("../validationSchema/registerValidationSchema");
const loginSchema = require("../validationSchema/loginValidationSchema");
const express = require("express");
const router = express.Router();
const { login, logout, register } = require("../controller/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", validationMiddleware(registerSchema), register);

router.post("/login", validationMiddleware(loginSchema), login);

router.get("/logout", authMiddleware, logout);

module.exports = router;