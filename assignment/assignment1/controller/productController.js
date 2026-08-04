const productModel = require("../model/productModel");

const createProduct = async (req, res) => {
  try {
    const { name, price, category, SKU } = req.body;
    const product = {
      name,
      price,
      category,
      SKU,
    };
    let productExist = await productModel.findOne({ SKU });
    if (productExist) {
      return res.status(400).send({ message: "Product already exist!" });
    }
    const newproduct = await productModel.create(product);
    res.status(201).json({
      message: "Product created successfully",
      product: newproduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ meassage: "Internal Server Error" });
  }
};

const deleteProductBySku = async (req, res) => {
  const sku = req.params.sku;
  if (!sku) {
    return res.status(400).json({ message: "give sku to delete product!" });
  }
  const isExist = await productModel.findOne({ SKU: sku });
  if (!isExist) {
    return res.status(404).send({ message: "Product does not exist!" });
  }
  await productModel.deleteOne({ SKU: sku });
  res.status(200).json({ message: "product deleted successfully!!" });
};

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 2, sort = "asc" } = req.query;
    const allProducts = await productModel
      .find({})
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ price: sort === "asc" ? 1 : -1 })
      .select("-_id -SKU -__v");
    res.json({ meassage: "All products : ", allProducts });
  } catch (err) {
    console.log(err);
    res.status(500).send({ meassage: "Internal Server Error" });
  }
};

const updateProductById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "give id to delete product!" });
    }
    const updateProduct = await productModel.findOneAndUpdate(
      { _id: id },
      {
        $set: req.body,
      },
      { returnDocument: "after" },
    );
    if (!updateProduct) {
      return res.status(404).json({ message: "product not found!" });
    }
    res.json({ message: "product update", updateProduct });
  } catch (err) {
    console.log(err);
    res.status(500).send({ meassage: "Internal Server Error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "give id to delete product!" });
    }
    const product = await productModel
      .findOne({ _id: id })
      .select("-SKU -_id -__v");
    if (!product) {
      return res.status(400).send({ message: "Product does not exist!" });
    }
    res.json({ product });
  } catch (err) {
    console.log(err);
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
