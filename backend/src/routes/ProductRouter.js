const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const authAdminMiddleware = require("../middleware/authAdminMiddleware");

//Tao loai - Tao chat lieu - Tao
router.post("/create-product", productController.createProduct);
router.put(
  "/update-product/:productId",
  //   authAdminMiddleware,
  productController.updateProduct
);
router.delete(
  "/delete-product/:productId",
  authAdminMiddleware,
  productController.deleteProduct
);
router.get("/get-product/:productId", productController.getProductById);
router.get("/get-all-products", productController.getAllProducts);
router.get("/get-all", productController.getAll);
router.get(
  "/product-count-by-category",
  productController.productCountByCategory
);
// router.get('/material/:materialId', productController.fillByMaterial)
// router.get('/category/:categoryId', productController.fillByCategory)
router.get("/fill-products", productController.fillProducts);
router.get("/search/:keyword", productController.searchProducts);
router.get("/quantity/:productId", productController.getQuantity);
router.put("/update-quantity/:id", productController.updateQuantity);
router.get("/get-quantity/:quantityId", productController.getQuantityById);
router.post("/create-quantity", productController.createQuantity);
router.delete(
  "/delete-quantity/:id",
  authAdminMiddleware,
  productController.deleteQuantity
);
router.get("/color/:colorId", productController.getColorById);
router.get("/get-all-color", productController.getAllColor);

module.exports = router;
