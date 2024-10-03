const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");

router.get("/get-all-category", categoryController.getAllCategories);
router.post("/create-category", categoryController.createCategory);

module.exports = router;
