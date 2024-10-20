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
const updateMaterial = async (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkMaterial = await Material.findOne({
        _id: id, //MongodB sử dụng ID dạng _id
      });
      if (checkMaterial == null) {
        resolve({
          status: "ERR",
          message: "The material is not defined",
        });
      }
      const updateMaterial = await Material.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "Update material success",
        data: updateMaterial,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteMaterial = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkMaterial = await Material.findOne({
        _id: id, //MongodB sử dụng ID dạng _id
      });
      if (checkMaterial == null) {
        resolve({
          status: "ERR",
          message: "The material is not defined",
        });
      }
      await Material.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete material SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getMaterialById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkMaterial = await Material.findOne({
        _id: id, //MongodB sử dụng ID dạng _id
      });
      if (checkMaterial == null) {
        resolve({
          status: "ERR",
          message: "The material is not defined",
        });
      } else {
        resolve({
          status: "OK",
          message: "Get material SUCCESS",
          material: checkMaterial,
        });
      }
      S;
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getMaterialById,
};
