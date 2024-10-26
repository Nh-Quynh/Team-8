const mongoose = require("mongoose");
const Order = require("../models/OrderModel");
const Status = require("../models/Status.Model");
const ObjId = mongoose.Types.ObjectId;

const getAllOrders = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // mongoose.set('debug', true)

      const orders = await Order.find()
        .populate("paymentMethod", "name")
        .populate("status", "name")
        // .populate("orderDetail")
        .populate({
          path: "orderDetail",
          populate: {
            path: "productQuantity",
            populate: {
              path: "product",
              select: "name price urlImage",
            },
          },
        });

      resolve({
        status: "OK",
        message: "Get all orders",
        data: orders,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getOrdersHistory = (limit, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      // mongoose.set('debug', true)

      const totalOrder = await Order.countDocuments();

      // {orderDate: -1} will sort orders in descending order
      // date format in mongodb: yyyy-mm-dd
      const ordersSort = { orderDate: -1 };
      const orders = await Order.find()
        .sort(ordersSort)
        .limit(limit)
        .skip(page * limit)
        .populate("paymentMethod")
        .populate("status")
        .populate({
          path: "orderDetail",
          populate: {
            path: "productQuantity",
            populate: {
              path: "product",
              select: "name price urlImage",
            },
          },
        });

      resolve({
        status: "OK",
        message: "Orders history",
        data: orders,
        totalOrder: totalOrder,
        totalPage: Math.ceil(totalOrder / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getOrderDetails = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      mongoose.set("debug", true);

      const order = await Order.findOne({ orderId: orderId })
        .populate("paymentMethod")
        .populate("status")
        .populate("orderDetail")
        .populate({
          path: "orderDetail",
          populate: {
            path: "productQuantity",
            populate: {
              path: "product",
              select: "name price urlImage",
            },
          },
        });

      resolve({
        status: "OK",
        message: "Order details",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateOrderStatus = (orderId, orderStatus) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: new ObjId(orderStatus) },
        { new: true }
      ).populate("status");

      resolve({
        status: "OK",
        message: "Update order status successful",
        data: updatedOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const cancelOrder = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      mongoose.set("debug", true);

      const order = await Order.findById(orderId).populate("status");

      if (order === null) {
        resolve({
          status: "OK",
          message: "The order is not existed",
        });
      }
      const orderStatus = order.status.name;

      // if the order was canceled, show message the order is ready canceled
      if (orderStatus == "bi huy") {
        resolve({
          status: "OK",
          message: "The order was already cancelled",
          data: order,
        });
      }
      // if the order is being prepared, set the order's status to canceled
      else if (
        orderStatus == "dang chuan bi" ||
        orderStatus == "dang cho duyet"
      ) {
        const canceledStatus = await Status.findOne({ name: "bi huy" });
        const canceledOrder = await Order.findByIdAndUpdate(
          orderId,
          { status: new ObjId(canceledStatus._id) },
          { new: true }
        );

        resolve({
          status: "OK",
          message: "The order was cancelled",
          data: canceledOrder,
        });
      }
      // if the order in another status, show message the order cannot canceled
      else {
        resolve({
          status: "OK",
          message: "You cannot cancel this order",
          reason_orderStatus: order.status.name,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const fillOrderByStatus = (statusId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await Order.find({ status: statusId })
        .populate("paymentMethod")
        .populate("status")
        .populate("orderDetail")
        .populate({
          path: "orderDetail",
          populate: {
            path: "productQuantity",
            populate: {
              path: "product",
              select: "name price urlImage",
            },
          },
        });

      resolve({
        status: "OK",
        message: "Order details",
        data: orders,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getOrdersCountByStatus = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // use aggregate to group orders by status and count the quantity of each status.
      const orders = await Order.aggregate([
        {
          $lookup: {
            // join with collection 'status'
            from: "status",
            // current collection attribute
            localField: "status",
            // foreign collection (status) attribute
            foreignField: "_id",
            // array contains data that combine with 'status' collection
            as: "statusDetails",
          },
        },
        {
          // split each element in the array into separate documents.
          $unwind: "$statusDetails",
        },
        {
          // group documents and count the number
          $group: {
            _id: "$statusDetails.name",
            count: { $sum: 1 },
          },
        },
      ]);

      resolve({ status: "OK", data: orders });
    } catch (e) {
      reject(e);
    }
  });
};

const getMonthlyRevenue = (year) => {
  return new Promise(async (resolve, reject) => {
    try {
      const revenue = await Order.aggregate([
        {
          $match: {
            orderDate: {
              $gte: new Date(`${year}-01-01T00:00:00.000Z`),
              $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$orderDate" },
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            price: "$totalRevenue",
          },
        },
      ]);

      resolve({ status: "OK", data: revenue });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllOrders,
  getOrdersHistory,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder,
  fillOrderByStatus,
  getOrdersCountByStatus,
  getMonthlyRevenue,
};
