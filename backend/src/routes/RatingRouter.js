const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/RatingController");

router.post("/rating-product", ratingController.ratingProduct);
router.put("/update-rating", ratingController.updateRating);

module.exports = router;
