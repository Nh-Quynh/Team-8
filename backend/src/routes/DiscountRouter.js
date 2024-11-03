const express = require("express");
const router = express.Router();
const discountController = require("../controllers/DiscountController");
const authAdminMiddleware = require("../middleware/authAdminMiddleware");

router.post("/create-discount", discountController.createDiscount);
router.get(
  "/get-all-discounts",
  // authAdminMiddleware,
  discountController.getAllDiscount
);
router.get("/get-discount/:discountId", discountController.getDiscount);
router.get(
  "/get-discount-by-product/:productId",
  discountController.getDiscountByProductId
);
router.put("/update-discount/:discountId", discountController.updateDiscount);
router.delete(
  "/delete-discount/:discountId",
  discountController.deleteDiscount
);

module.exports = router;
