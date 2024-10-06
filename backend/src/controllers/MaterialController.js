const MaterialService = require("../services/MaterialService");

const createMaterial = async (req, res) => {
  try {
    const { materialId, name } = req.body;
    if (!materialId || !name) {
      return res.status(400).json({
        status: "ERR",
        message: "Name or ID not filled in",
      });
    }
    const newMaterial = await MaterialService.createMaterial(req.body);
    return res.status(200).json(newMaterial);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllMaterials = async (req, res) => {
  try {
    const response = await MaterialService.getAllMaterials();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createMaterial,
  getAllMaterials,
};
