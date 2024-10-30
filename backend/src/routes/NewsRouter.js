const express = require("express");
const router = express.Router();
const newsController = require("../controllers/NewsController");
const authSaleMiddleware = require("../middleware/authSalesMiddleware");

router.post("/create-news" , newsController.createNews);
router.get("/get-all-news", authSaleMiddleware, newsController.getAllNews);
router.get("/get-news/:newsId", authSaleMiddleware, newsController.getNewsById);
router.put("/update-news/:newsId", authSaleMiddleware, newsController.updateNews);
router.delete("/delete-news/:newsId", newsController.deleteNews);

module.exports = router;