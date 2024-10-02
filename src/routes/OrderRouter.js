const express = require('express')
const router = express.Router()
const orderController = require('../controllers/OrderController')

router.get('/get-all-orders', orderController.getAllOrders)

module.exports = router