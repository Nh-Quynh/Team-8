// const Category = require('../models/CategoryModel')
const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      price,
      description,
      // images,
      categoryId,
      materialId,
      // color,
      // quantity,
    } = req.body;
    if (
      !productId ||
      !name ||
      !price ||
      !description ||
      !categoryId ||
      !materialId
      // !color ||
      // !quantity
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
    const { category: categoryId, material: materialId } = req.query;

    const response = await ProductService.fillProducts(categoryId, materialId);
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
    const response = await ProductService.searchProducts(keyword);
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
    const { quantity, images } = req.body;
    if (!quantityId) {
      return res.status(200).json({
        status: "ERR",
        message: "The quantity is required",
      });
    }
    const response = await ProductService.updateQuantity(
      quantityId,
      quantity,
      images
    );
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
    const { color, quantity, images, productId } = req.body;
    if (!color && !productId && !quantity) {
      return res.status(200).json({
        status: "ERR",
        message: "The product, color, and quantity are required",
      });
    }
    console.log("toi day");
    const response = await ProductService.createQuantity(req.body);
    console.log(response);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteQuantity = async (req, res) => {
  try {
    const quantityId = req.params.id;
    if (!quantityId) {
      return res.status(200).json({
        status: "ERR",
        message: "The quantityId is required",
      });
    }
    const response = await ProductService.deleteQuantity(quantityId);
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
const getAll = async (req, res) => {
  try {
    // const { category, material } = req.query;
    const response = await ProductService.getAll();

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const productCountByCategory = async (req, res) => {
  try {
    const response = await ProductService.productCountByCategory();

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const topSellingProducts = async (req, res) => {
  try {
    const response = await ProductService.topSellingProducts();

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "An error occurred while fetching data",
    });
  }
};
const totalProductsSold = async (req, res) => {
  try {
    const response = await ProductService.totalProductsSold();

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "An error occurred while fetching data",
    });
  }
};
const lowStockProductsWithColor = async (req, res) => {
  try {
    const response = await ProductService.lowStockProductsWithColor();

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "An error occurred while fetching data",
    });
  }
};
const getQuantityById = async (req, res) => {
  try {
    const quantityId = req.params.quantityId;
    // const quantity = req.body.quantity;
    if (!quantityId) {
      return res.status(200).json({
        status: "ERR",
        message: "The quantity is required",
      });
    }
    const response = await ProductService.getQuantityById(quantityId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const searchProductByAdmin = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const response = await ProductService.searchProductByAdmin(keyword);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getImageById = async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const response = await ProductService.getImageById(imageId);
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
  getAll,
  fillProducts,
  searchProducts,
  getQuantity,
  updateQuantity,
  deleteQuantity,
  getColorById,
  getAllColor,
  createQuantity,
  productCountByCategory,
  topSellingProducts,
  getQuantityById,
  searchProductByAdmin,
  totalProductsSold,
  lowStockProductsWithColor,
  getImageById,
};
