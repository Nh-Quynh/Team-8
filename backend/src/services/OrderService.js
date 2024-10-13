const mongoose = require('mongoose')
const Order = require('../models/OrderModel')
const Status = require('../models/StatusModel')
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

            const totalOrder = await Order.countDocuments()

            // {orderDate: -1} will sort orders in descending order
            // date format in mongodb: yyyy-mm-dd
            const ordersSort = {orderDate: -1}
            const orders = await Order.find()
                .sort(ordersSort)
                .limit(limit)
                .skip(page * limit)
                .populate('paymentMethod')
                .populate('status')

            resolve({
                status: 'OK',
                message: 'Orders history',
                order: orders,
                totalOrder: totalOrder,
                totalPage: Math.ceil(totalOrder / limit)
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

            const order = await Order.findById(orderId).populate('paymentMethod').populate('status')

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

const updateOrderStatus = (orderId, orderStatus) => {
    return new Promise(async (resolve, reject) => {
        try {

        } catch(e) {
            reject(e)
        }
    })
}

const cancelOrder = (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            mongoose.set('debug', true)

            const order = await Order.findById(orderId).populate('status')

            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The order is not existed'
                })
            }
            const orderStatus = order.status.name

            // if the order was canceled, show message the order is ready canceled
            if (orderStatus == 'bi huy') {
                resolve({
                    status: 'OK',
                    message: 'The order was already cancelled',
                    data: order
                })
            }
            // if the order is being prepared, set the order's status to canceled
            else if (orderStatus == 'dang chuan bi' || orderStatus == 'dang cho duyet') {
                const canceledStatus = await Status.findOne({name: 'bi huy'})
                const canceledOrder = await Order.findByIdAndUpdate(orderId, {status: new ObjId(canceledStatus._id)}, {new: true})

                resolve({
                    status: 'OK',
                    message: 'The order was cancelled',
                    data: canceledOrder
                })
            }
            // if the order in another status, show message the order cannot canceled
            else {
                resolve({
                    status: 'OK',
                    message: 'You cannot cancel this order',
                    reason_orderStatus: order.status.name
                })
            }
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    getAllOrders,
    getOrdersHistory,
    getOrderDetails,
    updateOrderStatus,
    cancelOrder,
}