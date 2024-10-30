const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const authSalesMiddleware = require("../middleware/authSalesMiddleware");

router.post("/create-order/:userId", orderController.createOrder);
router.get("/get-all-orders", orderController.getAllOrders);
router.get("/get-orders-history", orderController.getOrdersHistory);
router.get("/get-details/:orderId", orderController.getOrderDetails);
router.put("/cancel-order/:orderId", orderController.cancelOrder);
// router.get(
//   "/user/:userId/status/:statusName",
//   orderController.getOrderbyStatus
// );

// only sale employees can update order status
router.put(
  "/update-status/:orderId",
  authSalesMiddleware,
  orderController.updateOrderStatus
);

module.exports = router;
