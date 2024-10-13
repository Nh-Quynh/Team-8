const express = require("express");
const router = express.Router();
const materialController = require("../controllers/MaterialController");
router.post("/create-material", materialController.createMaterial);
router.get("/get-all-material", materialController.getAllMaterials);

module.exports = router;
