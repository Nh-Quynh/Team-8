const Category = require("../models/CategoryModel");

const createCategory = async (newCategory) => {
  const { id_category, name } = newCategory;
  const checkCategory = await Category.findOne({ id_category });

  try {
    if (checkCategory) {
      return {
        status: "OK",
        message: "Category available",
        checkCategory,
      };
    } else {
      const category = await Category.create({
        id_category,
        name,
      });
      return {
        status: "OK",
        message: "Created new category",
        category,
      };
    }
  } catch (e) {
    // In ra lỗi để dễ debug
    console.error("Error in createCategory service:", e);
    throw new Error(e.message);
  }
};
const getAllCategories = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allCategories = await Category.find();
      resolve({
        status: "OK",
        message: "Get all categories",
        data: allCategories,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllCategories,
  createCategory,
};
