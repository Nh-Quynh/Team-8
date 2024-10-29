const mongoose = require("mongoose");
const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const Customer = require("../models/CustomerModel");
const OrderDetail = require("../models/OrderDetailModel");
const PaymentMethod = require("../models/PaymentMethodModel");
// const Discount = require("../models/DiscountModel");
const Quantity = require("../models/QuantityModel");
const Status = require("../models/Status.Model");
const Product = require("../models/ProductModel");
const DiscountService = require("../services/DiscountService");
const ObjId = mongoose.Types.ObjectId;
const StatusService = require("../services/StatusService");
const generateOrderID = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};
const createOrder = (userId, newOrder) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { itemIds, deliveryMethod, deliveryFee, address, paymentMethod } =
        newOrder;

      // Kiểm tra người dùng hợp lệ
      const checkUser = await Customer.findById(userId);
      if (!checkUser) {
        return reject({ status: "ERR", message: "The user is undefined" });
      }

      // Tìm giỏ hàng của người dùng
      const cart = await Cart.findOne({ customer: userId });
      if (!cart) {
        return reject({ status: "ERR", message: "Cart not found" });
      }

      // Kiểm tra số lượng của từng item
      const insufficientItems = [];
      const validItems = [];

      for (const itemId of itemIds) {
        const item = cart.items.find((item) => item._id.toString() === itemId);
        if (!item) {
          insufficientItems.push({ itemId, message: "Item not found in cart" });
          continue;
        }

        const quantityObj = await Quantity.findById(item.quantityId);
        if (!quantityObj) {
          insufficientItems.push({ itemId, message: "Quantity not found" });
          continue;
        }

        const requestedQuantity = item.quantity;
        if (requestedQuantity > quantityObj.quantity) {
          insufficientItems.push({ itemId, message: "Insufficient quantity" });
        } else {
          validItems.push(item);
        }
      }

      // Kiểm tra nếu không có mặt hàng hợp lệ
      if (validItems.length === 0) {
        return resolve({
          status: "ERR",
          message: "No valid items to create an order",
          details: insufficientItems, // Trả về thông tin các mặt hàng không hợp lệ
        });
      }

      let totalAmount = 0; // Lưu tổng tiền chưa giảm
      let totalDiscount = 0; // Lưu tiền giảm
      const orderDetails = []; // Lưu mảng id detail

      for (const item of validItems) {
        const quantityValid = await Quantity.findById(item.quantityId);
        const product = await Product.findById(quantityValid.product);

        const discounts = await DiscountService.getDiscountByProductId(
          product._id
        );
        // Tạo detail
        const orderDetail = await OrderDetail.create({
          productQuantity: item.quantityId,
          quantity: item.quantity,
        });
        orderDetails.push(orderDetail._id);

        // Cập nhật số lượng còn lại trong kho
        quantityValid.quantity -= item.quantity;
        await quantityValid.save();

        // Xóa item khỏi giỏ hàng
        await Cart.updateOne(
          { userId: userId },
          { $pull: { items: { _id: item._id } } }
        );

        // Tính toán giảm giá
        if (discounts.status === "OK") {
          for (const discount of discounts.data) {
            const discountAmount =
              ((product.price * discount.discountPercent) / 100) *
              item.quantity;
            totalDiscount += discountAmount;
          }
        }

        totalAmount += product.price * item.quantity;
        console.log("Current Total Amount:", totalAmount);
      }

      // Đảm bảo tổng tiền giảm không vượt quá tổng tiền
      if (totalDiscount > totalAmount) totalDiscount = totalAmount;
      const totalPrice = totalAmount - totalDiscount;

      let checkPaymentMethod = await PaymentMethod.findOne({
        name: paymentMethod,
      });
      if (!checkPaymentMethod) {
        checkPaymentMethod = await PaymentMethod.create({
          name: paymentMethod,
        });
      }

      const status = await StatusService.getStatusDefault();

      const orderNew = await Order.create({
        orderID: generateOrderID(),
        orderDetail: orderDetails,
        totalPrice: totalPrice,
        deliveryMethod,
        deliveryFee,
        orderDate: Date.now(),
        address,
        paymentMethod: checkPaymentMethod._id,
        status: status,
      });

      resolve({
        status: "OK",
        message: "Create order success",
        data: orderNew,
        totalDiscount: totalDiscount,
        totalAmount: totalAmount,
      });
    } catch (e) {
      console.error("Error creating order:", e);
      reject({
        status: "ERR",
        message: e.message || "An error occurred while creating the order.",
      });
    }
  });
};

const getAllOrders = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // mongoose.set('debug', true)

      const orders = await Order.find();

      resolve({
        status: "OK",
        message: "Get all orders",
        orders: orders,
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
        .populate("status");

      resolve({
        status: "OK",
        message: "Orders history",
        order: orders,
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

      const order = await Order.findById(orderId)
        .populate("paymentMethod")
        .populate("status");

      resolve({
        status: "OK",
        message: "Order details",
        detail: order,
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

module.exports = {
  getAllOrders,
  getOrdersHistory,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder,
  createOrder,
};
