const mongoose = require('mongoose')
const Order = require('../models/OrderModel')
const ObjId = mongoose.Types.ObjectId


const getAllOrders = () => {
    return new Promise(async (resolve, reject) => {
        try {
            mongoose.set('debug', true)

            const orders = await Order.find()

            console.log("[ORDERS]", orders)

            resolve({
                status: "OK",
                message: "Get all orders",
                orders: orders
            })
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    getAllOrders,
}