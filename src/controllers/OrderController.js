const OrderService = require('../services/OrderService')

const getAllOrders = async (req, res) => {
    try {
        const response = await OrderService.getAllOrders()
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getOrdersHistory = async (req, res) => {
    try {
        const {limit, page} = req.query

        const response = await OrderService.getOrdersHistory(limit || 8, page || 0)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.orderId

        const response = await OrderService.getOrderDetails(orderId)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

// update order status with order id from request parameters and status id form request query
const updateOrderStatus = async(req, res) => {
    try {
        const orderId = req.params.orderId
        const statusId = req.query.statusId

        const response = await OrderService.updateOrderStatus(orderId, statusId)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId

        if(!orderId) {
            return res.status(200).json({
                status: 'OK',
                message: 'The order id is required'
            })
        }
        
        const response = await OrderService.cancelOrder(orderId)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    getAllOrders,
    getOrdersHistory,
    getOrderDetails,
    updateOrderStatus,
    cancelOrder,
}