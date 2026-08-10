const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  createAddress,
  getAddresses,
  getAllAddresses,
  updAddress,
  delAddress
} = require("../controller/addressController");
const validationMiddleware = require("../middlewares/validationMiddleware");
const validateSchema = require("../validationSchema/addressValidationSchema");
const authorization = require("../middlewares/autorizationMiddleware");

router.post(
  "/createAddress",
  validationMiddleware(validateSchema),
  authMiddleware,
  authorization("admin", "user", "seller"),
  createAddress,
);

router.get("/getAddress", authMiddleware, authorization("user"), getAddresses);

router.get(
  "/getAllAddress",
  authMiddleware,
  authorization("admin"),
  getAllAddresses,
);

router.put(
  "/updateAddress/:id",
  authMiddleware,
  authorization("user","admin"),
  updAddress,
);

router.delete(
  "/deleteAddress/:id",
  authMiddleware,
  authorization("admin", "user"),
  delAddress
);

module.exports = router;
