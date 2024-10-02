const express = require('express')
const router = express.Router()
const orderController = require('../controllers/OrderController')

router.get('/get-all-orders', orderController.getAllOrders)
router.get('/get-orders-history', orderController.getOrdersHistory)
router.get('/order/:orderId', orderController.getOrderDetails)

module.exports = router