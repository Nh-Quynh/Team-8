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

module.exports = {
    getAllOrders,
}