const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const authUserMiddleWare = require("../middleware/authMiddleware");
const authAdminMiddleware = require("../middleware/authAdminMiddleware");
const authSalesMiddleware = require("../middleware/authSalesMiddleware");

// ============== Customer ==============
router.post("/sign-up", userController.createCustomer);
router.post("/sign-in", userController.loginCustomer);
router.put("/update-customer/:id", userController.updateCustomer);
router.put(
  "/update-status/:id",
  authAdminMiddleware,
  userController.updateStatusCustomer
);
router.delete(
  "/delete-customer/:id",
  authAdminMiddleware, //tim hieu sau
  userController.deleteCustomer
);

router.get("/get-all", userController.getAllCustomer);
router.get(
  "/get-details/:id",
  authUserMiddleWare,
  userController.getCustomerById
);
router.post("/log-out", userController.logoutUser);
router.post("/add-to-cart/:id", userController.addProductToCart);
router.get("/view-cart/:id", userController.viewCart);
router.put(
  "/item-increment/:userId/:itemId",
  userController.incrementItemProduct
);
router.put(
  "/item-decrement/:userId/:itemId",
  userController.decrementItemProduct
);
router.delete("/item-delete/:userId/:itemId", userController.deleteItemProduct);
//Xem chi tiet nguoi dung = email

// ============== Employee ==============
router.post(
  "/employee/create",
  // authAdminMiddleware,
  userController.createEmployee
);
router.post("/employee/sign-in", userController.loginEmployee);
router.put("/employee/update-employee/:id", userController.updateEmployee);
router.delete(
  "/employee/delete-employee/:id",
  // authAdminMiddleware, //tim hieu sau
  userController.deleteEmployee
);
router.get(
  "/employee/get-all",
  // authAdminMiddleware,
  userController.getAllEmployee
);
router.get(
  "/employee/get-details/:id",
  authUserMiddleWare,
  userController.getEmployeeById
);
router.put(
  "/employee/update-status/:id",
  // authAdminMiddleware,
  userController.updateStatusEmployee
);
router.put(
  "/employee/update-role/:id",
  // authAdminMiddleware,
  userController.updateRoleEmployee
);
router.post("/refresh-token", userController.refreshToken);

router.post("/employee/log-out", userController.logoutUser);

module.exports = router;
