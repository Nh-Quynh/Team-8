const express = require("express");
const router = express.Router();
const materialController = require("../controllers/MaterialController");
router.post("/create-material", materialController.createMaterial);
router.get("/get-all-material", materialController.getAllMaterials);
router.delete("/delete-material/:id", materialController.deleteMaterial);
router.put("/update-material/:id", materialController.updateMaterial);
router.get("/get-material/:id", materialController.getMaterialById);

module.exports = router;
