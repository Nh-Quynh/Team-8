// const Category = require('../models/CategoryModel')
const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      price,
      description,
      urlImage,
      categoryId,
      materialId,
      color,
      quantity,
    } = req.body;
    if (
      !productId ||
      !name ||
      !price ||
      !description ||
      !urlImage ||
      !categoryId ||
      !materialId ||
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

//Cap nhat thong tin san pham
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const data = req.body;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await ProductService.updateProduct(productId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
//Xoa san pham theo id
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
//Tim san pham theo id
const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await ProductService.getProductById(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await ProductService.getAllProducts(
      limit || 8,
      Number(page) || 0,
      sort
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// const fillByMaterial = async (req, res) => {
//     try {
//         const materialId = req.params.materialId
//         const {limit, page} = req.query

//         const response = await ProductService.fillByMaterial(materialId, limit || 8, page || 0)
//         return res.status(200).json(response)
//     } catch(e) {
//         return res.status(404).json({
//             message: e
//         })
//     }
// }

// const fillByCategory = async (req, res) => {
//     try {
//         const categoryId = req.params.categoryId
//         const {limit, page} = req.query

//         const response = await ProductService.fillByCategory(categoryId, limit || 8, page || 0)
//         return res.status(200).json(response)
//     } catch(e) {
//         return res.status(404).json({
//             message: e
//         })
//     }
// }

const fillProducts = async (req, res) => {
  try {
    const {
      category: categoryId,
      material: materialId,
      limit,
      page,
    } = req.query;

    const response = await ProductService.fillProducts(
      categoryId,
      materialId,
      limit || 8,
      page || 0
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const { limit, page } = req.query;

    const response = await ProductService.searchProducts(
      keyword,
      limit || 8,
      page || 0
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
// Controller để lấy số lượng sản phẩm
const getQuantity = async (req, res) => {
  try {
    const productId = req.params.productId; // Lấy productId từ URL parameters
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await ProductService.getQuantity(productId); // Gọi hàm quantityProduct

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateQuantity = async (req, res) => {
  try {
    const quantityId = req.params.id;
    const data = req.body;
    if (!quantityId) {
      return res.status(200).json({
        status: "ERR",
        message: "The quantity is required",
      });
    }
    const response = await ProductService.updateQuantity(quantityId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const createQuantity = async (req, res) => {
  try {
    // const product = req.params.id;
    const { color, quantity, productId } = req.body;
    if (!color && !productId && !quantity) {
      return res.status(200).json({
        status: "ERR",
        message: "The product or color or quantity is required",
      });
    }
    const response = await ProductService.createQuantity(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteQuantity = async (req, res) => {
  try {
    const { color, product } = req.body;
    if (!color && !product) {
      return res.status(200).json({
        status: "ERR",
        message: "The product or color is required",
      });
    }
    const response = await ProductService.deleteQuantity(color, product);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getColorById = async (req, res) => {
  try {
    const colorId = req.params.colorId; // Lấy productId từ URL parameters
    if (!colorId) {
      return res.status(200).json({
        status: "ERR",
        message: "The colorId is required",
      });
    }
    const response = await ProductService.getColorById(colorId); // Gọi hàm quantityProduct

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllColor = async (req, res) => {
  try {
    const response = await ProductService.getAllColor();

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  // fillByMaterial,
  // fillByCategory,
  fillProducts,
  searchProducts,
  getQuantity,
  updateQuantity,
  deleteQuantity,
  getColorById,
  getAllColor,
  createQuantity,
};
