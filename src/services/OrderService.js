const mongoose = require('mongoose')
const Order = require('../models/OrderModel')
const ObjId = mongoose.Types.ObjectId


const getAllOrders = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // mongoose.set('debug', true)
            const orders = await Order.find()

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

const getOrdersHistory = (limit, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            // mongoose.set('debug', true)

            // {orderDate: -1} will sort orders in descending order
            // date format in mongodb: yyyy-mm-dd
            const ordersSort = {orderDate: -1}
            const orders = await Order.find().sort(ordersSort).limit(limit).skip(page * limit)

            resolve({
                status: 'OK',
                message: 'Orders history',
                order: orders
            })
        } catch(e) {
            reject(e)
        }
    })
}

const getOrderDetails = (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            mongoose.set('debug', true)

            const order = await Order.find({'_id': new ObjId(orderId)})

            resolve({
                status: 'OK',
                message: 'Order details',
                detail: order
            })
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    getAllOrders,
    getOrdersHistory,
    getOrderDetails,
}