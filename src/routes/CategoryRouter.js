const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");

router.post("/create-category", categoryController.createCategory);
router.get("/get-all-category", categoryController.getAllCategories);
module.exports = router;
