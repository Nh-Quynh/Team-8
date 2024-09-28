const express = require('express')
const router = express.Router()
const productController = require('../controllers/ProductController')

router.get('/get-all-product', productController.getAllProducts)
router.get('/material/:materialId', productController.fillByMaterial)

module.exports = router