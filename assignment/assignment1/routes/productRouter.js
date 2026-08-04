const validationMiddleware = require("../middlewares/validationMiddleware");
const createProductSchema = require("../validationSchema/createProductValidationSchema");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createProduct,
  deleteProductBySku,
  getAllProducts,
  updateProductById,
  getProductById,
} = require("../controller/productController");

router.post(
  "/createProduct",
  authMiddleware,
  validationMiddleware(createProductSchema),
  createProduct,
);

router.delete("/deleteProductBySku/:sku", authMiddleware, deleteProductBySku);

router.get("/getAllProducts", authMiddleware, getAllProducts);

router.put("/updateProductById/:id", authMiddleware, updateProductById);

router.get("/getProductById/:id", getProductById);

module.exports = router;
