const {
  createProductService,
  deleteProductService,
  getAllProductsService,
  updateProductService,
  getProductByIdService,
  searchProduct,
} = require("../service/productService");
const imageModel = require("../model/imageModel");
const cloudinary = require("../config/cloudinary");
// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const { name, price, category, SKU } = req.body;

    const newProduct = await createProductService(name, price, category, SKU);

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
    const { page = 1, limit = 2, sort = "asc" } = req.query;

    const allProducts = await getAllProductsService(page, limit, sort);

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

    const updateProduct = await updateProductService(id, req.body);

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

const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "search query is required",
      });
    }

    const products = await searchProduct(query);
    return res.json(products);
  } catch (err) {
    console.log(err);
    if (err.message == "product not found!!")
      return res.status(404).json({ message: "product not found!!" });
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

//for diskStorage

// const uploadProduct = async (req, res) => {
//   try {
//     if (req.files.length===0) {
//       return res.status(400).json({
//         message: "Product image is required",
//       });
//     }
//     console.log(req.files);

//     return res.status(200).json({
//       message: "Product image uploaded successfully",
//       files: req.files,
//     });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       message: "Error uploading product image",
//       error: error.message,
//     });
//   }
// };

//for memeory storage + cloudinary
const uploadProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Images are required",
      });
    }
    const uploadedImages = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(file.buffer);
      });
      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
      await imageModel.create({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
    return res.status(200).json({
      message: "Images uploaded successfully",
      images: uploadedImages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error uploading images",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  deleteProductBySku,
  getAllProducts,
  updateProductById,
  getProductById,
  searchProducts,
  uploadProduct,
};
