const Material = require("../models/MaterialModel");

const createMaterial = async (newMaterial) => {
  const { materialId, name } = newMaterial;
  const checkMaterial = await Material.findOne({ materialId });

  try {
    if (checkMaterial) {
      return {
        status: "OK",
        message: "Material available",
        checkMaterial,
      };
    } else {
      const material = await Material.create({
        materialId,
        name,
      });
      return {
        status: "OK",
        message: "Created new material",
        material,
      };
    }
  } catch (e) {
    // In ra lỗi để dễ debug
    console.error("Error in createMaterial service:", e);
    throw new Error(e.message);
  }
};

const getAllMaterials = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allMaterials = await Material.find();
      resolve({
        status: "OK",
        message: "Get all materials",
        data: allMaterials,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllMaterials,
  createMaterial,
};
