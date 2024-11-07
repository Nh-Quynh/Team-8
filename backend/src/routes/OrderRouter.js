const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const authSalesMiddleware = require("../middleware/authSalesMiddleware");

router.post("/create-order/:userId", orderController.createOrder);
router.get("/get-invoice/:orderId", orderController.getInvoiceByOrderId);
router.get("/get-all-orders", orderController.getAllOrders);
router.get("/get-orders-history", orderController.getOrdersHistory);
router.get("/get-details/:orderId", orderController.getOrderDetails);
router.put("/cancel-order/:orderId", orderController.cancelOrder);
router.get(
  "/user/:userId/status/:statusName",
  orderController.getOrderbyStatus
);

// router.get(
//   "/user/:userId/status/:statusName",
//   orderController.getOrderbyStatus
// );
router.get("/fill-order/:statusId", orderController.fillOrderByStatus);
router.get(
  "/get-order-count-by-status",
  orderController.getOrdersCountByStatus
);
router.get("/get-monthly-revenue/:year", orderController.getMonthlyRevenue);
// only sale employees can update order status
router.put(
  "/update-status/:orderId",
  // authSalesMiddleware,
  orderController.updateOrderStatus
);
router.delete("/delete-reset", orderController.resetOrderInvoice);

module.exports = router;
