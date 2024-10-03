// const Category = require('../models/CategoryModel')
const ProductService = require('../services/ProductService')

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
}

const getAllProducts = async (req, res) => {
    try {
        const {limit, page, sort, filter} = req.query
        const response = await ProductService.getAllProducts(limit || 8, Number(page) || 0, sort)
        return res.status(200).json(response)
    } catch(e)
    {
        return res.status(404).json({
            message: e
        })
    }
}

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
        const { category: categoryId, material: materialId, limit, page } = req.query

        const response = await ProductService.fillProducts(categoryId, materialId, limit || 8, page || 0)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const searchProducts = async (req, res) => {
    try {
        const keyword = req.params.keyword
        const {limit, page} = req.query
        
        const response = await ProductService.searchProducts(keyword, limit || 8, page || 0)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    // fillByMaterial,
    // fillByCategory,
    fillProducts,
    searchProducts
}