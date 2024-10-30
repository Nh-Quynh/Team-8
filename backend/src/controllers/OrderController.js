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

const fillOrderByStatus = async (req, res) => {
  try {
      const statusId = req.params.statusId;

      const response = await OrderService.fillOrderByStatus(statusId);
      return res.status(200).json(response)
  }
  catch (e)
  {
      return res.status(404).json({
          message: e
      })
  }
}

const getOrdersCountByStatus = async (req, res) => {
  try {
      const response = await OrderService.getOrdersCountByStatus();
      return res.status(200).json(response)
  }
  catch (e)
  {
      return res.status(404).json({
          message: e
      })
  }
}

const getMonthlyRevenue = async (req, res) => {
  try {
      // convert parameter type to number
      const year = parseInt(req.params.year);

      const response = await OrderService.getMonthlyRevenue(year);
      return res.status(200).json(response)
  }
  catch (e)
  {
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
  fillOrderByStatus,
  getOrdersCountByStatus,
  getMonthlyRevenue,
  createOrder,
};
