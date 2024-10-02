const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
router.post("/create-product", productController.createProduct);

//Tao loai - Tao chat lieu - Tao
// router.post("/sign-in", userController.loginCustomer);
// router.put("/update-customer/:id", userController.updateCustomer);
// router.delete(
//   "/delete-customer/:id",
//   userController.deleteCustomer
// );
// router.get("/getAll", userController.getAllCustomer);
// router.get("/get-details/:id", userController.getDetailsCustomer);
module.exports = router;
