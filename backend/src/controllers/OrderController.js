const OrderService = require("../services/OrderService");
const mongoose = require("mongoose");

const createOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      itemIds,
      deliveryMethod,
      deliveryFee,
      address,
      paymentMethod,
      VAT,
    } = req.body;
    console.log("Request Body:", req.body);
    if (
      !userId ||
      !itemIds ||
      !deliveryMethod ||
      !deliveryFee ||
      !address ||
      !paymentMethod ||
      !VAT
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
    const response = await OrderService.getOrdersHistory();
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

// update order status with order id from request parameters and status id form request body
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const statusId = req.body.statusId;

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
const fillOrderByStatus = async (req, res) => {
  try {
    const statusId = req.params.statusId;

    const response = await OrderService.fillOrderByStatus(statusId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getOrdersCountByStatus = async (req, res) => {
  try {
    const response = await OrderService.getOrdersCountByStatus();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getMonthlyRevenue = async (req, res) => {
  try {
    // convert parameter type to number
    const year = parseInt(req.params.year);

    const response = await OrderService.getMonthlyRevenue(year);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getInvoiceByOrderId = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The missing value",
      });
    }
    const response = await OrderService.getInvoiceByOrderId(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const resetOrderInvoice = async (req, res) => {
  try {
    const response = await OrderService.resetOrderInvoice();
    console.log("tới đây");
    return res.status(200).json(response);
  } catch (e) {
    console.error("Lỗi khi reset đơn hàng:", e.message); // Log lỗi để dễ debug
    return res.status(500).json({
      message: e.message || "Có lỗi xảy ra trong quá trình xử lý",
    });
  }
};
const getCountFailOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const response = await OrderService.getCountFailOrder(userId);
    return res.status(200).json(response);
  } catch (e) {
    console.error(e.message); // Log lỗi để dễ debug
    return res.status(500).json({
      message: e.message || "Có lỗi xảy ra trong quá trình xử lý",
    });
  }
};
const getTotalRevenue = async (req, res) => {
  try {
    const response = await OrderService.getTotalRevenue();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getTotalSales = async (req, res) => {
  try {
    const response = await OrderService.getTotalSales();
    return res.status(200).json(response);
  }
  catch(e)
  {
    return res.status(404).json({
      message: e,
    });
  }
}

module.exports = {
  getAllOrders,
  getOrdersHistory,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder,
  fillOrderByStatus,
  getOrdersCountByStatus,
  getMonthlyRevenue,
  createOrder,
  getOrderbyStatus,
  getInvoiceByOrderId,
  resetOrderInvoice,
  getCountFailOrder,
  getTotalRevenue,
  getTotalSales,
};
