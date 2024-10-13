const express = require('express')
const router = express.Router()
const orderController = require('../controllers/OrderController')

router.get('/get-all-orders', orderController.getAllOrders)
router.get('/get-orders-history', orderController.getOrdersHistory)
router.get('/get-details/:orderId', orderController.getOrderDetails)
router.put('/cancel-order/:orderId', orderController.cancelOrder)
router.put('/update-status/:orderId', orderController.updateOrderStatus)

module.exports = router