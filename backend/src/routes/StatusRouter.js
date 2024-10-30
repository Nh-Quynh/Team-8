const express = require("express");
const router = express.Router();
const statusController = require("../controllers/StatusController");

router.post("/create-status", statusController.createStatus);
router.get("/get-status/:statusId", statusController.getStatus);

module.exports = router;
