const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const authAdminMiddleware = require("../middleware/authAdminMiddleware");

//Tao loai - Tao chat lieu - Tao
router.post("/create-product", productController.createProduct);
router.get(
  "/update-product/:productId",
  //   authAdminMiddleware,
  productController.updateProduct
);
router.delete(
  "/delete-product/:productId",
  //   authAdminMiddleware,
  productController.deleteProduct
);
router.get("/get-product/:productId", productController.getProductById);
router.get("/get-all-products", productController.getAllProducts);
// router.get('/material/:materialId', productController.fillByMaterial)
// router.get('/category/:categoryId', productController.fillByCategory)
router.get("/fill-products", productController.fillProducts);
router.get("/search/:keyword", productController.searchProducts);
router.get("/quantity/:productId", productController.getQuantity);
router.put("/update-quantity", productController.updateQuantity);
router.delete(
  "/delete-quantity",
  //   authAdminMiddleware,
  productController.deleteQuantity
);
router.get("/color/:colorId", productController.getColorById);
router.get("/get-all-color", productController.getAllColor);

module.exports = router;
