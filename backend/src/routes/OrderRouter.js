const express = require('express')
const router = express.Router()
const orderController = require('../controllers/OrderController')
const authSalesMiddleware = require('../middleware/authSalesMiddleware')

router.get('/get-all-orders', orderController.getAllOrders)
router.get('/get-orders-history', orderController.getOrdersHistory)
router.get('/get-details/:orderId', orderController.getOrderDetails)
router.put('/cancel-order/:orderId', orderController.cancelOrder)
router.get('/fill-order/:statusId', orderController.fillOrderByStatus);
// only sale employees can update order status
router.put('/update-status/:orderId', authSalesMiddleware, orderController.updateOrderStatus)

module.exports = router