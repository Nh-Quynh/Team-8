const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");

router.post("/create-category", categoryController.createCategory);
router.delete("/delete-category/:id", categoryController.deleteCategory);
router.put("/update-category/:id", categoryController.updateCategory);
router.get("/get-all-category", categoryController.getAllCategories);
router.get("/get-category/:id", categoryController.getCategoryById);

module.exports = router;
