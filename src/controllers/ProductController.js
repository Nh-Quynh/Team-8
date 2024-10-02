const ProductService = require("../services/ProductService");

// Tao san pham
const createProduct = async (req, res) => {
  try {
    const {
      id_product,
      name,
      price,
      description,
      urlImage,
      category,
      material,
      color,
      quantity,
    } = req.body;
    if (
      !id_product ||
      !name ||
      !price ||
      !description ||
      !urlImage ||
      !category ||
      !material ||
      !color ||
      !quantity
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "Missing required fields",
      });
    }
    const product = await ProductService.createProduct(req.body);
    return res.status(200).json(product);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  createProduct,
};
