const productModel = require("../model/productModel");

// CREATE PRODUCT
const createProductService = async (name, price, category, SKU) => {
  const product = {
    name,
    price,
    category,
    SKU,
  };

  const productExist = await productModel.findOne({ SKU });

  if (productExist) {
    throw new Error("Product already exist!");
  }

  const newProduct = await productModel.create(product);

  return newProduct;
};

// DELETE PRODUCT
const deleteProductService = async (sku) => {
  const isExist = await productModel.findOne({ SKU: sku });

  if (!isExist) {
    throw new Error("Product does not exist!");
  }

  await productModel.deleteOne({ SKU: sku });

  return true;
};

// GET ALL PRODUCTS
const getAllProductsService = async (page, limit, sort) => {
  const allProducts = await productModel
    .find({})
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ price: sort === "asc" ? 1 : -1 })
    .select("-_id -SKU -__v");

  return allProducts;
};

// UPDATE PRODUCT
const updateProductService = async (id, data) => {
  const updateProduct = await productModel.findOneAndUpdate(
    { _id: id },
    {
      $set: data,
    },
    { returnDocument: "after" },
  );

  if (!updateProduct) {
    throw new Error("product not found!");
  }

  return updateProduct;
};

// GET PRODUCT BY ID
const getProductByIdService = async (id) => {
  const product = await productModel
    .findOne({ _id: id })
    .select("-SKU -_id -__v");

  if (!product) {
    throw new Error("Product does not exist!");
  }

  return product;
};

const searchProduct = async(query) => {
  const products = await productModel.find({
    name:{
      $regex:query,
      $options:"i"
    }
  })
  if (products.length === 0) {
    throw new Error("product not found!!");
  }
  return products;
};

module.exports = {
  createProductService,
  deleteProductService,
  getAllProductsService,
  updateProductService,
  getProductByIdService,
  searchProduct
};
