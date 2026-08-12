const validationMiddleware = require("../middlewares/validationMiddleware");
const createProductSchema = require("../validationSchema/createProductValidationSchema");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/autorizationMiddleware");

const {
  createProduct,
  deleteProductBySku,
  getAllProducts,
  updateProductById,
  getProductById,
  searchProducts
} = require("../controller/productController");

router.post(
  "/createProduct",
  authMiddleware,
  authorization("admin", "seller"),
  validationMiddleware(createProductSchema),
  createProduct,
);

router.delete(
  "/deleteProductBySku/:sku",
  authMiddleware,
  authorization("admin", "seller"),
  deleteProductBySku,
);

router.get(
  "/getAllProducts",
  getAllProducts,
);

router.put(
  "/updateProductById/:id",
  authMiddleware,
  authorization("admin", "seller"),
  updateProductById,
);

router.get(
  "/getProductById/:id",
  getProductById,
);

router.get(
  "/searchProduct",
  searchProducts
)

module.exports = router;
