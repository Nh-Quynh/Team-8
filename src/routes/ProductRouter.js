const express = require('express')
const router = express.Router()
const productController = require('../controllers/ProductController')

router.get('/get-all-product', productController.getAllProducts)
router.get('/material/:materialId', productController.fillByMaterial)
router.get('/category/:categoryId', productController.fillByCategory)
router.get('/fill-products', productController.fillProducts)
router.get('/search/:keyword', productController.searchProducts)

module.exports = router