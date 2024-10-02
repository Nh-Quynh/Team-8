const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
// const authUserMiddleware = require("../middleware/authUserMiddleware");

//Customer
router.post("/sign-up", userController.createCustomer);
router.post("/sign-in", userController.loginCustomer);
router.put("/update-customer/:id", userController.updateCustomer);
router.put("/update-status", userController.updateStatusCustomer);
router.delete(
  "/delete-customer/:id",
  // authAdminMiddleWare, //tim hieu sau
  userController.deleteCustomer
);
router.get("/getAll", userController.getAllCustomer);
router.get(
  "/get-details/:id",
  // authUserMiddleware,
  userController.getDetailsCustomer
);
//Xem chi tiet nguoi dung = email

//Employee
router.post("/employee/create", userController.createEmployee);
router.post("/employee/sign-in", userController.loginEmployee);
router.put("/employee/update-employee/:id", userController.updateEmployee);
router.delete(
  "/employee/delete-employee/:id",
  // authMiddleWare, //tim hieu sau
  userController.deleteEmployee
);
router.get("/employee/getAll", userController.getAllEmployee);
router.get("/employee/get-details/:id", userController.getDetailsEmployee);
router.put("/employee/update-status", userController.updateStatusEmployee);

module.exports = router;
