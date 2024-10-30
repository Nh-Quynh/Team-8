const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { itemIds, deliveryMethod, deliveryFee, address, paymentMethod } =
      req.body;
    console.log("Request Body:", req.body);
    if (
      !userId ||
      !itemIds ||
      !deliveryMethod ||
      !deliveryFee ||
      !address ||
      !paymentMethod
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The missing value",
      });
    }
    const response = await OrderService.createOrder(userId, req.body);
    console.log("Order creation response:", response);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const response = await OrderService.getAllOrders();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getOrdersHistory = async (req, res) => {
  try {
    const { limit, page } = req.query;

    const response = await OrderService.getOrdersHistory(limit || 8, page || 0);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const response = await OrderService.getOrderDetails(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// update order status with order id from request parameters and status id form request query
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const statusId = req.query.statusId;

    const response = await OrderService.updateOrderStatus(orderId, statusId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(200).json({
        status: "OK",
        message: "The order id is required",
      });
    }

    const response = await OrderService.cancelOrder(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getOrderbyStatus = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId); // Khởi tạo ObjectId cho userId
    const statusName = req.params.statusName; // Lấy tên trạng thái từ params

    const response = await OrderService.getOrderbyStatus(userId, statusName); // Gọi service với status name
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getAllOrders,
  getOrdersHistory,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder,
  createOrder,
  getOrderbyStatus,
};
