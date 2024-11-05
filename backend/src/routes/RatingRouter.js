const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/RatingController");

router.post("/rating-product", ratingController.ratingProduct);
router.put("/update-rating", ratingController.updateRating);
router.get(
  "/average-rating/:productId",
  ratingController.getProductAverageRating
);
router.get(
  "/check-rating/:userId/:orderId/:productId",
  ratingController.checkRating
);

module.exports = router;
