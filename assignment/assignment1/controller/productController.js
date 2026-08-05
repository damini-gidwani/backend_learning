const {
  createProductService,
  deleteProductService,
  getAllProductsService,
  updateProductService,
  getProductByIdService,
} = require("../service/productService");

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const { name, price, category, SKU } = req.body;

    const newProduct = await createProductService(
      name,
      price,
      category,
      SKU
    );

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.log(err);

    if (err.message === "Product already exist!") {
      return res.status(400).send({
        message: err.message,
      });
    }

    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// DELETE PRODUCT
const deleteProductBySku = async (req, res) => {
  try {
    const sku = req.params.sku;

    if (!sku) {
      return res.status(400).json({
        message: "give sku to delete product!",
      });
    }

    await deleteProductService(sku);

    res.status(200).json({
      message: "product deleted successfully!!",
    });
  } catch (err) {
    console.log(err);

    if (err.message === "Product does not exist!") {
      return res.status(404).send({
        message: err.message,
      });
    }

    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 2,
      sort = "asc",
    } = req.query;

    const allProducts = await getAllProductsService(
      page,
      limit,
      sort
    );

    res.json({
      message: "All products : ",
      allProducts,
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// UPDATE PRODUCT
const updateProductById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        message: "give id to update product!",
      });
    }

    const updateProduct = await updateProductService(
      id,
      req.body
    );

    res.json({
      message: "product update",
      updateProduct,
    });
  } catch (err) {
    console.log(err);

    if (err.message === "product not found!") {
      return res.status(404).json({
        message: err.message,
      });
    }

    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// GET PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        message: "give id to get product!",
      });
    }

    const product = await getProductByIdService(id);

    res.json({
      product,
    });
  } catch (err) {
    console.log(err);

    if (err.message === "Product does not exist!") {
      return res.status(404).send({
        message: err.message,
      });
    }

    res.status(500).send("SERVER ERROR!");
  }
};

module.exports = {
  createProduct,
  deleteProductBySku,
  getAllProducts,
  updateProductById,
  getProductById,
};